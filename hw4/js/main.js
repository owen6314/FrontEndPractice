//判断是否为移动端并开始游戏
if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||   
    browser.versions.iPhone || browser.versions.iPad)	//移动端
{
	isMobile = true;
	ableToMove = true;
	smove.prepare();
}
else
{
  	isMobile = false;
	smove.prepare();
}