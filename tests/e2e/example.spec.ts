import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check if the main heading is visible
  await expect(page.locator('h1')).toBeVisible()
  
  // Check if the page title contains StudyAI
  await expect(page).toHaveTitle(/StudyAI/)
})