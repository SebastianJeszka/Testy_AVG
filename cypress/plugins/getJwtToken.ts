import 'chromedriver';
import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const generatorAuthPage = {
  getLoginTypeSelect: () => By.id('loginType'),
  getOptions: () => By.css('.mat-option'),
  getLoginButton: () => By.css('[data-testid=loginButton]')
};

const govPressAuthPage = {
  getEmailField: () => By.id('email'),
  getPasswordField: () => By.id('password'),
  getLoginButton: () => By.css('button')
};

const WAITING_TIME_TRESHOLD = 10000;

export default async ({ baseUrl, govPressUser }) => {
  const chromeCapabilities = new chrome.Options();
  const browser = new Builder().setChromeOptions(chromeCapabilities).forBrowser('chrome').build();
  await browser.get(baseUrl);
  await browser.wait(until.elementLocated(generatorAuthPage.getLoginTypeSelect()), WAITING_TIME_TRESHOLD);
  await browser.findElement(generatorAuthPage.getLoginTypeSelect()).click();
  await browser.findElement(generatorAuthPage.getOptions()).click();
  await browser.findElement(generatorAuthPage.getLoginButton()).click();
  const [generatorTab, govPressTab] = await browser.getAllWindowHandles();
  await browser.switchTo().window(govPressTab);
  await browser.wait(until.elementLocated(govPressAuthPage.getEmailField()), WAITING_TIME_TRESHOLD);
  await browser.findElement(govPressAuthPage.getEmailField()).sendKeys(govPressUser.email);
  await browser.findElement(govPressAuthPage.getPasswordField()).sendKeys(govPressUser.password);
  await browser.findElement(govPressAuthPage.getLoginButton()).click();
  await browser.switchTo().window(generatorTab);
  await browser.sleep(1000);
  const token = await browser.executeScript(() => {
    return localStorage.getItem('generator-form-jwt-token');
  });
  await browser.quit();
  return token;
};
