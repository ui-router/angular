import { test, expect } from '@playwright/test';

test.describe('Angular app', () => {
  test('loads', async ({ page }) => {
    await page.goto('/');
  });

  test('loads home state by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home/);
  });

  test('renders uisref as links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a', { hasText: 'home' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'about' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'lazy' }).first()).toBeVisible();
    await expect(page.locator('a', { hasText: 'lazy.child' }).first()).toBeVisible();
    await expect(page.locator('a', { hasText: 'lazy.child.viewtarget' })).toBeVisible();
  });

  test('renders home', async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('a', { hasText: 'home' })).toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'about' })).not.toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('home works');
  });

  test('renders about', async ({ page }) => {
    await page.goto('/home');
    await page.goto('/about');
    await expect(page.locator('a', { hasText: 'home' })).not.toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'about' })).toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('about works');
  });

  test('loads lazy routes', async ({ page }) => {
    await page.goto('/home');
    await page.goto('/lazy');
    await expect(page.locator('a', { hasText: 'home' })).not.toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'lazy' }).first()).toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('lazy works');
  });

  test('routes to lazy routes', async ({ page }) => {
    await page.goto('/lazy');
    await expect(page.locator('a', { hasText: 'home' })).not.toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'lazy' }).first()).toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('lazy works');
  });

  test('routes to lazy child routes', async ({ page }) => {
    await page.goto('/lazy/child');
    await expect(page.locator('a', { hasText: 'home' })).not.toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'lazy.child' }).first()).toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('lazy.child works');
  });

  test('targets named views', async ({ page }) => {
    await page.goto('/lazy/child/viewtarget');
    await expect(page.locator('a', { hasText: 'home' })).not.toHaveClass(/active/);
    await expect(page.locator('a', { hasText: 'lazy.child' }).first()).toHaveClass(/active/);
    await expect(page.locator('#default')).toContainText('lazy.child works');
    await expect(page.locator('#header')).toContainText('lazy.child.viewtarget works');
    await expect(page.locator('#footer')).toContainText('lazy.child.viewtarget works');
  });
});
