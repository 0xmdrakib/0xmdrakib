// Run with playwright-cli run-code; see docs/SITE_INTEGRATION.md.
async (page) => {
  const expect=(ok,message)=>{if(!ok)throw new Error(message);};
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto('http://127.0.0.1:4174/');
  await page.locator('#hq-content main').waitFor({state:'attached'});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#fn').fill('Retained preview draft');
  await page.evaluate(()=>{
    window.__originalHeader=document.getElementById('nav');
    window.__originalForm=document.getElementById('cf');
    window.__originalHQ=document.getElementById('hq-content');
    window.__documentOrigin=performance.timeOrigin;
    window.__switchTimes=[];
    document.addEventListener('click',()=>window.__lastClick=performance.now(),true);
    document.addEventListener('site:change',()=>window.__switchTimes.push(performance.now()-window.__lastClick));
  });
  const documents=[];
  const onRequest=request=>{if(request.isNavigationRequest()&&request.resourceType()==='document')documents.push(request.url());};
  page.on('request',onRequest);
  const rect=()=>page.locator('#nav .site-switcher').boundingBox();
  const assertPersistent=async()=>expect(await page.evaluate(()=>window.__originalHeader===document.getElementById('nav')&&window.__originalForm===document.getElementById('cf')&&window.__originalHQ===document.getElementById('hq-content')&&window.__documentOrigin===performance.timeOrigin),'A switch replaced the document or permanent shell');
  const select=async(index,site)=>{
    await page.locator('#nav .site-switcher a').nth(index).click();
    await page.waitForFunction(site=>document.documentElement.dataset.site===site,site);
    await page.waitForTimeout(200);
    await assertPersistent();
  };
  const results=[];
  for(const width of [320,390,768,850,900,901,1024,1304,1440]) {
    await page.setViewportSize({width,height:884});
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    const before=await rect();
    for(const [index,site] of [[1,'hq'],[0,'personal']]) {
      await select(index,site);
      const after=await rect();
      expect(['x','y','width','height'].every(key=>Math.abs(before[key]-after[key])<.02),`Tab moves at ${width}`);
      const layout=await page.evaluate(()=>{
        const site=document.documentElement.dataset.site;
        const panel=document.querySelector(`[data-site-panel="${site}"]`);
        const header=document.getElementById('nav');
        const tabs=header.querySelector('.site-switcher').getBoundingClientRect();
        return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,center:Math.abs(tabs.x+tabs.width/2-header.getBoundingClientRect().width/2),headings:[...panel.querySelectorAll('h1,h2,h3')].filter(el=>el.scrollWidth>el.clientWidth+1).length,visiblePanels:[...document.querySelectorAll('[data-site-panel]')].filter(el=>!el.hidden).length,heroVisible:site!=='personal'||[...panel.querySelector('.hero-copy').children].every(el=>getComputedStyle(el).opacity==='1')};
      });
      expect(layout.overflow<=0&&layout.headings===0&&(width<=900||layout.center<=1)&&layout.visiblePanels===1&&layout.heroVisible,`Layout regression ${site} ${width}: ${JSON.stringify(layout)}`);
      expect(await page.locator('#nav .site-switcher a[aria-current="page"]').getAttribute('aria-label')===(site==='hq'?'RakibHQ':'Personal'),'Wrong selected tab');
      if([320,390,768,1304].includes(width)) {
        await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
        await page.waitForTimeout(350);
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForTimeout(350);
        await page.screenshot({path:`output/playwright/spa-${site}-${width}-full.png`,fullPage:true});
      }
      await page.screenshot({path:`output/playwright/spa-${site}-${width}.png`});
      results.push({site,width,overflow:layout.overflow});
    }
  }
  await page.setViewportSize({width:390,height:844});
  expect(await page.locator('#fn').inputValue()==='Retained preview draft','Form draft was lost');
  await page.locator('.hero-btns a').first().click();
  await page.waitForURL('**/#projects');
  await page.getByRole('link',{name:'View All',exact:true}).first().click();
  await page.waitForURL('**/hq/');
  await page.locator('.hero-actions a[href="#ecosystem"]').click();
  await page.waitForURL('**/hq/#ecosystem');
  await page.waitForFunction(()=>{const y=document.getElementById('ecosystem').getBoundingClientRect().top;return Math.abs(y-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop))<1;});
  await page.getByRole('searchbox').fill('AgentDomain');
  expect(await page.locator('.registry-row').count()===1,'Search failed');
  const registryScroll=await page.evaluate(()=>scrollY);
  await select(0,'personal');
  await page.goBack();
  await page.waitForFunction(()=>document.documentElement.dataset.site==='hq');
  expect(await page.getByRole('searchbox').inputValue()==='AgentDomain','Registry search was lost');
  const restoredScroll=await page.evaluate(()=>scrollY);
  expect(Math.abs(restoredScroll-registryScroll)<=1,`Back did not restore scroll: ${restoredScroll} vs ${registryScroll}`);
  await page.goForward();
  await page.waitForFunction(()=>document.documentElement.dataset.site==='personal');
  await page.evaluate(()=>{const links=document.querySelectorAll('#nav .site-switcher a');links[1].click();links[0].click();links[1].click();links[0].click();});
  await page.waitForTimeout(250);
  expect(await page.evaluate(()=>document.documentElement.dataset.site==='personal'&&location.pathname==='/'),'Rapid switching ended on the wrong page');
  await page.emulateMedia({reducedMotion:'reduce'});
  await select(1,'hq'); await select(0,'personal');
  await page.evaluate(()=>{document.startViewTransition=undefined;});
  await select(1,'hq'); await select(0,'personal');
  expect(await page.locator('#fn').inputValue()==='Retained preview draft','Fallback navigation lost the form');
  await assertPersistent();
  expect(documents.length===0,`Switches reloaded the page: ${JSON.stringify(documents)}`);
  const times=await page.evaluate(()=>window.__switchTimes.filter(Number.isFinite));
  page.off('request',onRequest);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://127.0.0.1:4174/hq/#ecosystem');
  await page.waitForFunction(()=>{const target=document.getElementById('ecosystem');if(!target)return false;const y=target.getBoundingClientRect().top;return y>=72&&y<innerHeight;});
  expect(await page.title()==='RakibHQ','Direct HQ entry failed');
  await page.locator('#nav .site-switcher a').first().click();
  await page.waitForFunction(()=>document.documentElement.dataset.site==='personal');
  expect(errors.length===0,JSON.stringify(errors));
  return {results,documentRequestsDuringSwitch:documents.length,persistentDOM:true,stateAndHistory:'passed',rapidAndFallback:'passed',directDeepLink:'passed',switchLatencyMs:{min:Math.min(...times),max:Math.max(...times)},errors};
}
