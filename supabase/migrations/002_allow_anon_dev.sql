-- BuildTrack AI - Development: allow anon to create/use projects without auth
-- Run this in Supabase SQL Editor so "Create project" works when not logged in.
-- When you add Supabase Auth later, remove these policies or run 003_reenable_rls.sql

-- Projects: anon can manage rows where user_id is null (unauthenticated dev use)
CREATE POLICY "Allow anon to manage projects without user (dev)"
  ON projects FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Expenses: anon can manage expenses for projects that have user_id null
CREATE POLICY "Allow anon to manage expenses for unowned projects (dev)"
  ON expenses FOR ALL TO anon
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  );

-- Budget categories: same as expenses
CREATE POLICY "Allow anon to manage budget_categories for unowned projects (dev)"
  ON budget_categories FOR ALL TO anon
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  );

-- Construction phases: same
CREATE POLICY "Allow anon to manage construction_phases for unowned projects (dev)"
  ON construction_phases FOR ALL TO anon
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  );

-- Activity log: anon can insert/select where project is unowned or null
CREATE POLICY "Allow anon to manage activity_log for unowned projects (dev)"
  ON activity_log FOR ALL TO anon
  USING (
    project_id IS NULL
    OR project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  )
  WITH CHECK (
    project_id IS NULL
    OR project_id IN (SELECT id FROM projects WHERE user_id IS NULL)
  );
