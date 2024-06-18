import { expect } from '@wdio/globals';

describe('Messages', () => {
  it('Loggging user 1 into ADSM App', async () => {
    await browser.url('');
    await browser.maximizeWindow();
    const usernameInput = await $('//*[@id="formBasicEmail"]');
    const passwordInput = await $('//*[@id="formBasicPassword"]');
    const loginBtn = await $('//*[@id="root"]/div/div/div/div/form/button');
    await usernameInput.waitForDisplayed({ timeout: 300000 });
    await passwordInput.waitForDisplayed({ timeout: 300000 });
    await loginBtn.waitForDisplayed({ timeout: 300000 });
    await usernameInput.scrollIntoView();
    await usernameInput.addValue('seenu');
    await passwordInput.scrollIntoView();
    await passwordInput.addValue('Behappy@2024');
    await loginBtn.click();
    const timelineHeader = await $('//*[@id="root"]/div[1]/div[1]/h2');
    await timelineHeader.waitForDisplayed({ timeout: 300000 });
    await expect(timelineHeader).toHaveText('AraosDev');
    await expect(timelineHeader).toExist();
  });
  it('Texting User 2', async () => {
    const chatIcon = await $('//*[@data-testid="add-post"]');
    await chatIcon.waitForDisplayed({ timeout: 300000 });
    await chatIcon.click();
    const newChatBtn = await $('//*[@id="root"]/div[2]/div/div/div[1]/span');
    await newChatBtn.waitForDisplayed({ timeout: 300000 });
    await expect(newChatBtn).toExist();
    const chatMember = await $('//*[@id="root"]/div[2]/div/div/div[2]/div[2]');
    const chatUserName = await $(
      '//*[@id="root"]/div[2]/div/div/div[2]/div[2]/div[2]/span[1]'
    );
    await expect(chatUserName).toHaveText('Chitra');
    await chatMember.click();
    const msgSendBtn = await $('//*[@data-testid="message-send"]');
    await msgSendBtn.waitForDisplayed({ timeout: 300000 });
    await expect(msgSendBtn).toExist();
    const msgInput = await $('//*[@id="root"]/div[2]/div/div[3]/input');
    await msgInput.addValue('Hi Chitra');
    await msgSendBtn.click();
    const logoutBtn = await $('//*[@data-testid="add-post"][3]');
    await logoutBtn.click();
  });
  it('Logging user 2 into ADSM App', async () => {
    const usernameInput = await $('//*[@id="formBasicEmail"]');
    const passwordInput = await $('//*[@id="formBasicPassword"]');
    const loginBtn = await $('//*[@id="root"]/div/div/div/div/form/button');
    await usernameInput.waitForDisplayed({ timeout: 300000 });
    await passwordInput.waitForDisplayed({ timeout: 300000 });
    await loginBtn.waitForDisplayed({ timeout: 300000 });
    await usernameInput.scrollIntoView();
    await usernameInput.addValue('Chitra');
    await passwordInput.scrollIntoView();
    await passwordInput.addValue('Befit@2024');
    await loginBtn.click();
    const timelineHeader = await $('//*[@id="root"]/div[1]/div[1]/h2');
    await timelineHeader.waitForDisplayed({ timeout: 300000 });
    await expect(timelineHeader).toHaveText('AraosDev');
    await expect(timelineHeader).toExist();
  });
  it('Replying to User 1', async () => {
    const chatIcon = await $('//*[@data-testid="add-post"]');
    await chatIcon.waitForDisplayed({ timeout: 300000 });
    await chatIcon.click();
    const newChatBtn = await $('//*[@id="root"]/div[2]/div/div/div[1]/span');
    await newChatBtn.waitForDisplayed({ timeout: 300000 });
    await expect(newChatBtn).toExist();
    const chatMember = await $('//*[@id="root"]/div[2]/div/div/div[2]/div');
    const chatUserName = await $(
      '//*[@id="root"]/div[2]/div/div/div[2]/div/div[2]/span[1]'
    );
    await expect(chatUserName).toHaveText('seenu');
    await chatMember.click();
    const msgSendBtn = await $('//*[@data-testid="message-send"]');
    await msgSendBtn.waitForDisplayed({ timeout: 300000 });
    await expect(msgSendBtn).toExist();
    const msgInput = await $('//*[@id="root"]/div[2]/div/div[3]/input');
    await msgInput.addValue('Hi Cnu');
    await msgSendBtn.click();
    const logoutBtn = await $('//*[@data-testid="add-post"][3]');
    await logoutBtn.click();
    const loginBtn = await $('//*[@id="root"]/div/div/div/div/form/button');
    await loginBtn.waitForDisplayed({ timeout: 300000 });
    await expect(loginBtn).toExist();
  });
});
