// Run with playwright-cli against the optimized production preview.
async page => {
  const expect=(ok,message)=>{if(!ok)throw new Error(message);};
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto('http://127.0.0.1:4174/');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2000);
  const documents=[];
  page.on('request',request=>{if(request.isNavigationRequest()&&request.resourceType()==='document')documents.push(request.url());});
  const results=[];
  const tagline='Agent-native identity and communications infrastructure';
  const repo='https://github.com/Talvono/AgentDomain';
  for(const [width,height] of [[319,568],[390,844],[497,884],[547,884],[390,1180],[768,1024],[844,390],[900,700],[980,884],[981,884],[1304,884],[1440,1080],[1920,1080],[1304,600]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(100);
    const layout=await page.locator('#home').evaluate(hero=>{
      const left=hero.querySelector('.hero-left'),art=hero.querySelector('.hero-right'),desc=hero.querySelector('.hero-desc');
      const h=hero.getBoundingClientRect(),l=left.getBoundingClientRect(),a=art.getBoundingClientRect(),o=art.querySelector('.orrery').getBoundingClientRect();
      return {position:getComputedStyle(art).position,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,heroHeight:h.height,copyHeight:l.height,artBottom:a.bottom,heroBottom:h.bottom,artWidth:a.width,artHeight:a.height,heroWidth:h.width,solarWidth:o.width,solarHeight:o.height,centerX:Math.abs(o.x+o.width/2-a.x-a.width/2),centerY:Math.abs(o.y+o.height/2-a.y-a.height/2),solarVisible:getComputedStyle(art.querySelector('.solar-etching')).display!=='none',gridHidden:['.hgrid','.hcross','.hconst'].every(selector=>getComputedStyle(art.querySelector(selector)).display==='none'),divider:getComputedStyle(art).borderTopWidth,pointerEvents:getComputedStyle(art).pointerEvents,copyColor:getComputedStyle(desc).color,headings:[...hero.querySelectorAll('h1,p')].every(el=>el.scrollWidth<=el.clientWidth+1)};
    });
    expect(layout.overflow<=0&&layout.headings,`Hero content failed ${width}x${height}: ${JSON.stringify(layout)}`);
    expect(layout.solarVisible&&layout.centerX<.1&&layout.centerY<.1&&Math.abs(layout.solarWidth-layout.solarHeight)<.1&&layout.solarWidth<=layout.artWidth-23&&layout.solarHeight<=layout.artHeight-23,'The solar system is not centered, circular or contained');
    if(width<=980) {
      expect(layout.position==='absolute'&&Math.abs(layout.heroHeight-layout.copyHeight)<1&&Math.abs(layout.artBottom-layout.heroBottom)<1&&Math.abs(layout.artWidth-layout.heroWidth)<1&&layout.gridHidden&&layout.divider==='0px'&&layout.pointerEvents==='none'&&layout.copyColor==='rgb(88, 72, 50)',`Background layout failed ${width}x${height}: ${JSON.stringify(layout)}`);
      expect(layout.heroHeight>=height,'The hero does not adapt to the viewport height');
    } else expect(layout.position==='relative'&&!layout.gridHidden,'Desktop illustration must retain its split layout');
    await page.screenshot({path:`output/playwright/centered-solar-final-${width}x${height}.png`});
    await page.locator('.hero-btns .btn-p').scrollIntoViewIfNeeded();
    expect(await page.locator('.hero-btns .btn-p').evaluate(button=>{const b=button.getBoundingClientRect();return document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.closest('.btn-p')===button;}),'The artwork blocks the hero button');
    const personalCard=page.locator('.work-card--agentdomain');
    expect(await personalCard.locator('.work-tagline').innerText()===tagline,'Personal tagline is stale');
    expect(await personalCard.locator('.work-source').getAttribute('href')===repo,'Personal source link is stale');
    await page.locator('.work-colophon').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const colophon=await page.locator('.work-colophon').evaluate(el=>{
      const box=el.getBoundingClientRect(),button=el.querySelector('.work-view-all--bottom').getBoundingClientRect(),copy=el.querySelector('.work-colophon-copy').getBoundingClientRect();
      return {rightAligned:Math.abs(button.right-box.right)<1,separated:copy.right+12<=button.left,overflow:el.scrollWidth-el.clientWidth,height:button.height};
    });
    expect(colophon.rightAligned&&colophon.separated&&colophon.overflow<=0&&colophon.height>=44,`Bottom View All layout failed ${width}: ${JSON.stringify(colophon)}`);
    await page.locator('.work-colophon').screenshot({path:`output/playwright/projects-bottom-final-${width}.png`});
    await page.locator('.work-view-all--bottom').click();
    await page.waitForFunction(()=>document.documentElement.dataset.site==='hq');
    const hqCard=page.locator('.registry-row').filter({has:page.getByRole('heading',{name:'AgentDomain',exact:true})});
    expect(await hqCard.locator('.registry-title p').innerText()===tagline,'HQ tagline is stale');
    expect(await hqCard.getByRole('link',{name:'Open AgentDomain GitHub repository'}).getAttribute('href')===repo,'HQ source link is stale');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'HQ overflow');
    await page.locator('#nav .site-switcher a[aria-label="Personal"]').click();
    await page.waitForFunction(()=>document.documentElement.dataset.site==='personal');
    await page.waitForTimeout(200);
    results.push({width,height,mode:width<=980?'centered background':'split',centerX:layout.centerX,centerY:layout.centerY,overflow:layout.overflow,bottomViewAll:'passed',agentDomain:'updated on both pages'});
  }
  for(const width of [390,1304]) {
    await page.setViewportSize({width,height:884});
    const before=await page.locator('.solar-revolve').first().evaluate(el=>getComputedStyle(el).transform);
    await page.waitForTimeout(80);
    expect(before!==await page.locator('.solar-revolve').first().evaluate(el=>getComputedStyle(el).transform),'Orbital animation stopped unexpectedly');
    await page.emulateMedia({reducedMotion:'reduce'});
    expect(await page.locator('.solar-revolve,.solar-corona').evaluateAll(elements=>elements.every(el=>getComputedStyle(el).animationName==='none')),'Reduced motion still animates the background');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  expect(documents.length===0,'View All or tab switch reloaded the document');
  expect(errors.length===0,`Browser errors: ${errors}`);
  return {results,animation:'passed',reducedMotion:'passed',documents:documents.length,errors};
}
