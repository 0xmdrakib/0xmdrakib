// Run against the optimized preview with playwright-cli run-code.
async (page) => {
  const expect = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto('http://127.0.0.1:4174/');
  await page.locator('.work-card').last().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const previewUrl = 'https://mdrakib.xyz/brand/mdrakib-social-preview-v4.png';
  const preview = await page.request.get('http://127.0.0.1:4174/brand/mdrakib-social-preview-v4.png');
  const previewBytes = await preview.body();
  expect(preview.ok() && preview.headers()['content-type'].includes('image/png') && previewBytes.readUInt32BE(16) === 1730 && previewBytes.readUInt32BE(20) === 909, 'Approved social preview is missing or has wrong dimensions');
  const navigationRequests = [];
  const onRequest = request => {
    if (request.isNavigationRequest() && request.resourceType() === 'document') navigationRequests.push(request.url());
  };
  page.on('request', onRequest);
  const select = async site => {
    await page.locator('#nav .site-switcher').getByRole('link', { name: site === 'hq' ? 'RakibHQ' : 'Personal', exact: true }).click();
    await page.waitForFunction(site => document.documentElement.dataset.site === site, site);
    await page.waitForTimeout(200);
    const previewMeta = await page.locator('meta[property="og:image"],meta[property="og:image:secure_url"],meta[name="twitter:image"]').evaluateAll(metas => metas.map(meta => meta.content));
    expect(previewMeta.length === 3 && previewMeta.every(url => url === previewUrl), `Stale social preview after selecting ${site}`);
  };
  const results = [];
  for (const width of [319, 320, 360, 390, 524, 548, 700, 768, 900, 901, 1024, 1304, 1440]) {
    await page.setViewportSize({ width, height: 884 });
    const sizes = {};
    for (const site of ['personal', 'hq']) {
      await select(site);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const header = await page.locator('#nav').evaluate(nav => {
        const rect = el => { const { x, y, width, height, right, bottom } = el.getBoundingClientRect(); return { x, y, width, height, right, bottom }; };
        const brand = nav.querySelector(`[data-${document.documentElement.dataset.site === 'hq' ? 'hq' : 'personal'}-ui]`);
        const switcher = nav.querySelector('.site-switcher');
        const action = nav.querySelector(document.documentElement.dataset.site === 'hq' ? '.header-github' : '.nav-cta');
        return { nav: rect(nav), brand: rect(brand), switcher: rect(switcher), action: rect(action), tabs: [...switcher.querySelectorAll('a')].map(rect), icons: [...switcher.querySelectorAll('svg')].every(el => getComputedStyle(el).display !== 'none'), iconCenters: [...switcher.querySelectorAll('a')].map(link => { const a=link.getBoundingClientRect(),s=link.querySelector('svg').getBoundingClientRect(); return Math.max(Math.abs(a.x+a.width/2-s.x-s.width/2),Math.abs(a.y+a.height/2-s.y-s.height/2)); }), indicator: rect(switcher.querySelector('.site-switcher-indicator')), selected: rect(switcher.querySelector('[aria-current="page"]')), frameBorder:getComputedStyle(switcher,'::before').borderTopStyle,frameBackground:getComputedStyle(switcher,'::before').backgroundColor,headerDivider:getComputedStyle(nav).boxShadow };
      });
      const navHeight=width<=900?64:72;
      expect(header.nav.height === navHeight, `Wrong header height: ${site} ${width}`);
      expect(header.brand.right + 3 <= header.switcher.x && header.switcher.right + 3 <= header.action.x, `Header controls overlap: ${site} ${width} ${JSON.stringify(header)}`);
      expect(Math.abs(header.brand.y + header.brand.height / 2 - navHeight/2) <= 1 && Math.abs(header.action.y + header.action.height / 2 - navHeight/2) <= 1, `Header controls misaligned: ${site} ${width}`);
      expect(header.icons === (width <= 900), `Wrong compact icon mode: ${site} ${width}`);
      if (width <= 900) {
        expect(header.tabs.every(tab => tab.width >= 44 && tab.height >= 44), `Small tab touch target: ${site} ${width}`);
        expect(header.iconCenters.every(error=>error<.05), `Icon not centered: ${site} ${width}`);
        expect(Math.abs(header.indicator.x+header.indicator.width/2-header.selected.x-header.selected.width/2)<.05 && Math.abs(header.indicator.y+header.indicator.height/2-header.selected.y-header.selected.height/2)<.05, `Active pill not centered: ${site} ${width}`);
        expect(Math.abs(header.action.x-header.switcher.right-8)<.05, `Unnecessary space between mobile controls: ${site} ${width}`);
        expect(header.brand.right+16<=header.switcher.x, `Insufficient room after name: ${site} ${width}`);
        expect(header.frameBorder==='solid'&&header.frameBackground!=='rgba(0, 0, 0, 0)', `Missing capsule frame: ${site} ${width}`);
        expect(header.headerDivider!=='none', `Missing mobile header divider before scrolling: ${site} ${width}`);
      }
      const capsuleEdges=await page.locator('#nav .site-switcher').evaluate(switcher=>{
        const b=switcher.getBoundingClientRect(),i=switcher.querySelector('.site-switcher-indicator').getBoundingClientRect();
        const compact=matchMedia('(max-width:900px)').matches,p=getComputedStyle(switcher,'::before');
        const frame=compact?{x:b.x+parseFloat(p.left),y:b.y+parseFloat(p.top),width:parseFloat(p.width),height:parseFloat(p.height)}:b;
        const top=i.y-frame.y,side=document.documentElement.dataset.site==='personal'?i.x-frame.x:frame.x+frame.width-i.right;
        return {top,side,bottom:frame.y+frame.height-i.bottom};
      });
      expect(Math.abs(capsuleEdges.top-capsuleEdges.side)<.05&&Math.abs(capsuleEdges.top-capsuleEdges.bottom)<.05,`Capsule rounding is not concentric: ${site} ${width} ${JSON.stringify(capsuleEdges)}`);
      if(site==='hq') expect(await page.locator('.hero-actions .action--primary .lucide-arrow-right').count()===1,'HQ Explore projects must use a right arrow');
      sizes[site] = header.switcher;
      await page.screenshot({ path: `output/playwright/work-${site}-header-${width}.png` });
      const panel = page.locator(`[data-site-panel="${site}"]`);
      const footer = panel.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const layout = await footer.evaluate(footer => {
        const box = footer.getBoundingClientRect();
        const content = footer.querySelector('.ft').getBoundingClientRect();
        const bad = [...footer.querySelectorAll('*')].filter(el => { const b = el.getBoundingClientRect(); return b.width && (b.left < box.left - 1 || b.right > box.right + 1 || el.scrollWidth > el.clientWidth + 1); }).map(el => el.className);
        return { left: content.left - box.left, right: box.right - content.right, height: box.height, columns: getComputedStyle(footer.querySelector('.ft')).gridTemplateColumns.split(' ').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, bad };
      });
      expect(layout.overflow <= 0 && layout.bad.length === 0, `Footer/document overflow: ${site} ${width} ${JSON.stringify(layout)}`);
      expect(layout.left >= 14 && Math.abs(layout.left - layout.right) <= 1, `Missing balanced footer padding: ${site} ${width} ${JSON.stringify(layout)}`);
      expect(layout.columns === (width <= 980 ? 1 : 3), `Wrong footer columns: ${site} ${width}`);
      sizes[`${site}Footer`] = layout;
      await page.screenshot({ path: `output/playwright/work-${site}-footer-${width}.png` });
      if (site === 'personal') {
        await page.locator('#projects').scrollIntoViewIfNeeded();
        await page.locator('#projects img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
        expect(await page.locator('.work-card').count() === 3, 'Expected only the three real projects');
        expect(await page.locator('#selected-work-title').innerText() === 'What I’ve Built', 'Wrong showcase title');
        expect(await page.locator('.work-view-all').count() === 2, 'Expected a View All action above and below projects');
        expect((await page.locator('.work-view-all').evaluateAll(links=>links.map(link=>link.getAttribute('href')))).every(href=>href==='/hq/'), 'Wrong View All destination');
        const projectLayout = await page.locator('#projects').evaluate(section => ({
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          bad: [...section.querySelectorAll('h2,h3,p,ul,a')].filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.className),
          images: [...section.querySelectorAll('img')].every(img => img.complete && img.naturalWidth > 0),
          columns: getComputedStyle(section.querySelector('.work-grid')).gridTemplateColumns.split(' ').length,
        }));
        expect(projectLayout.overflow <= 0 && !projectLayout.bad.length && projectLayout.images, `Project layout failed ${width}: ${JSON.stringify(projectLayout)}`);
        expect(projectLayout.columns === (width <= 700 ? 1 : 2), `Wrong project grid at ${width}`);
        if ([320, 390, 768, 1304].includes(width)) await page.locator('#projects').screenshot({ path: `output/playwright/work-showcase-${width}.png` });
      }
    }
    expect(['x', 'y', 'width', 'height'].every(key => Math.abs(sizes.personal[key] - sizes.hq[key]) < .02), `Switcher moved at ${width}`);
    expect(Math.abs(sizes.personalFooter.height - sizes.hqFooter.height) <= 2, `Footer sizes diverged at ${width}: ${JSON.stringify(sizes)}`);
    results.push({ width, headerRows: 1, footerPadding: sizes.hqFooter.left, footerHeight: sizes.hqFooter.height, overflow: sizes.hqFooter.overflow });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await select('personal');
  await page.locator('.hero-btns').getByRole('link', { name: 'Explore Projects', exact: true }).click();
  await page.waitForURL('**/#projects');
  await page.waitForFunction(() => { const y = document.getElementById('projects').getBoundingClientRect().top; return y >= 72 && y < 110; });
  await page.keyboard.press('Tab');
  await page.getByRole('link', { name: 'View All', exact: true }).first().focus();
  expect(await page.getByRole('link', { name: 'View All', exact: true }).first().evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Missing keyboard focus indicator');
  await page.keyboard.press('Enter');
  await page.waitForURL('**/hq/');
  await page.waitForFunction(() => document.documentElement.dataset.site === 'hq');
  await page.goBack();
  await page.waitForURL('**/#projects');
  await page.locator('.work-view-all--bottom').click();
  await page.waitForURL('**/hq/');
  await page.waitForFunction(()=>document.documentElement.dataset.site==='hq');
  await page.goBack();
  await page.waitForURL('**/#projects');
  await page.locator('#nav').getByRole('link', { name: 'Contact me', exact: true }).click();
  await page.waitForURL('**/#contact');
  await page.waitForFunction(() => { const y = document.getElementById('contact').getBoundingClientRect().top; return y >= 72 && y < 110; });
  expect(navigationRequests.length === 0, `Internal actions reloaded the page: ${navigationRequests}`);
  expect(errors.length === 0, `Browser errors: ${errors}`);
  page.off('request', onRequest);
  return { results, documentsDuringInternalNavigation: navigationRequests.length, projectImages: 'passed', viewAllAndKeyboard: 'passed', contactAnchor: 'passed', errors };
}
