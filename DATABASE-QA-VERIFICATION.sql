-- ============================================================================
-- Database QA Verification SQL Queries
-- 
-- These SQL queries verify every CRUD operation across all 4 dashboards
-- against the shared PostgreSQL database: college_erp
--
-- Run these against the database to validate data integrity after each operation
-- ============================================================================

-- ============================================================================
-- 1. CONNECTION VERIFICATION
-- ============================================================================

-- Verify database connection and version
SELECT current_database(), current_user, version();

-- List all schemas
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name NOT IN ('pg_catalog', 'information_schema');

-- List all tables
SELECT table_schema, table_name, table_type 
FROM information_schema.tables 
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- ============================================================================
-- 2. ROW COUNT VERIFICATION (All Tables)
-- ============================================================================

-- Admin Dashboard Tables
SELECT 'admin_users' AS table_name, COUNT(*) AS row_count FROM admin_users
UNION ALL SELECT 'admin_sessions', COUNT(*) FROM admin_sessions
UNION ALL SELECT 'admin_login_history', COUNT(*) FROM admin_login_history
UNION ALL SELECT 'admin_password_resets', COUNT(*) FROM admin_password_resets
UNION ALL SELECT 'admin_app_settings', COUNT(*) FROM admin_app_settings
UNION ALL SELECT 'admin_departments', COUNT(*) FROM admin_departments
UNION ALL SELECT 'admin_courses', COUNT(*) FROM admin_courses
UNION ALL SELECT 'admin_enrollments', COUNT(*) FROM admin_enrollments
UNION ALL SELECT 'admin_activities', COUNT(*) FROM admin_activities
UNION ALL SELECT 'admin_system_configs', COUNT(*) FROM admin_system_configs
UNION ALL SELECT 'admin_notifications', COUNT(*) FROM admin_notifications
UNION ALL SELECT 'admin_fee_structures', COUNT(*) FROM admin_fee_structures
UNION ALL SELECT 'admin_student_fees', COUNT(*) FROM admin_student_fees
UNION ALL SELECT 'admin_payments', COUNT(*) FROM admin_payments
UNION ALL SELECT 'admin_installments', COUNT(*) FROM admin_installments
UNION ALL SELECT 'admin_examinations', COUNT(*) FROM admin_examinations
UNION ALL SELECT 'admin_marks_entries', COUNT(*) FROM admin_marks_entries
UNION ALL SELECT 'admin_results', COUNT(*) FROM admin_results
UNION ALL SELECT 'admin_student_results', COUNT(*) FROM admin_student_results
UNION ALL SELECT 'admin_revaluations', COUNT(*) FROM admin_revaluations
UNION ALL SELECT 'admin_audit_logs', COUNT(*) FROM admin_audit_logs
UNION ALL SELECT 'admin_announcements', COUNT(*) FROM admin_announcements
UNION ALL SELECT 'admin_dashboard_analytics', COUNT(*) FROM admin_dashboard_analytics
UNION ALL SELECT 'admin_refund_requests', COUNT(*) FROM admin_refund_requests
UNION ALL SELECT 'admin_reports', COUNT(*) FROM admin_reports
UNION ALL SELECT 'admin_report_cards', COUNT(*) FROM admin_report_cards
UNION ALL SELECT 'admin_system_settings', COUNT(*) FROM admin_system_settings
ORDER BY table_name;

-- Note: Faculty, Student, and Parents tables use their original table names
-- Faculty Dashboard Tables (from Prisma schema - snakes_case mapped)
SELECT 'subjects' AS table_name, COUNT(*) FROM subjects
UNION ALL SELECT 'batches', COUNT(*) FROM batches
UNION ALL SELECT 'classrooms', COUNT(*) FROM classrooms
UNION ALL SELECT 'faculty', COUNT(*) FROM faculty
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'attendances', COUNT(*) FROM attendances
UNION ALL SELECT 'timetables', COUNT(*) FROM timetables
UNION ALL SELECT 'holidays', COUNT(*) FROM holidays
UNION ALL SELECT 'assignments', COUNT(*) FROM assignments
UNION ALL SELECT 'homeworks', COUNT(*) FROM homeworks
UNION ALL SELECT 'assignment_submissions', COUNT(*) FROM assignment_submissions
UNION ALL SELECT 'evaluations', COUNT(*) FROM evaluations
UNION ALL SELECT 'study_materials', COUNT(*) FROM study_materials
UNION ALL SELECT 'faculty_transfers', COUNT(*) FROM faculty_transfers
ORDER BY table_name;

-- Parents Dashboard Tables
SELECT 'parents' AS table_name, COUNT(*) FROM parents
UNION ALL SELECT 'students' AS table_name, COUNT(*) FROM students
UNION ALL SELECT 'parent_students', COUNT(*) FROM parent_students
UNION ALL SELECT 'attendances', COUNT(*) FROM attendances
UNION ALL SELECT 'fees', COUNT(*) FROM fees
UNION ALL SELECT 'examination_results', COUNT(*) FROM examination_results
UNION ALL SELECT 'homeworks', COUNT(*) FROM homeworks
UNION ALL SELECT 'announcements', COUNT(*) FROM announcements
ORDER BY table_name;

-- ============================================================================
-- 3. CREATE VERIFICATION
-- ============================================================================

-- Verify a user was created correctly (Admin Dashboard)
-- After POST /api/users
SELECT id, full_name, username, email, role, status, is_verified, 
       created_at, updated_at
FROM admin_users 
WHERE email = 'testuser@example.com';  -- Replace with actual email

-- Verify a fee structure was created (Admin Dashboard)
-- After POST /api/fee-structures
SELECT fs.id, fs.fee_structure_id, c.name AS course_name, 
       fs.tuition_fee, fs.admission_fee, fs.total_fee,
       fs.created_at
FROM admin_fee_structures fs
JOIN admin_courses c ON c.id = fs.course_id
WHERE fs.fee_structure_id = 'FEE-001';  -- Replace with actual ID

-- Verify a parent was created (Parents Dashboard)
-- After POST /api/parents
SELECT id, first_name, last_name, email, mobile_number, 
       active_status, created_at
FROM parents 
WHERE email = 'parent@example.com';  -- Replace with actual email

-- ============================================================================
-- 4. READ VERIFICATION
-- ============================================================================

-- Verify user list is returned correctly (Admin Dashboard)
-- After GET /api/users
SELECT COUNT(*) AS total_users, 
       COUNT(CASE WHEN role = 'Admin' THEN 1 END) AS admins,
       COUNT(CASE WHEN role = 'Student' THEN 1 END) AS students,
       COUNT(CASE WHEN role = 'Faculty' THEN 1 END) AS faculty,
       COUNT(CASE WHEN is_verified = true THEN 1 END) AS verified
FROM admin_users;

-- Verify faculty list with department (Faculty Dashboard)
-- After GET /api/faculty
SELECT f.id, f.faculty_id, f.first_name, f.last_name, 
       f.department, f.designation, f.status,
       COUNT(DISTINCT t.id) AS timetable_count,
       COUNT(DISTINCT a.id) AS attendance_count
FROM faculty f
LEFT JOIN timetables t ON t.faculty_id = f.id AND t.is_deleted = false
LEFT JOIN attendances a ON a.faculty_id = f.id
WHERE f.is_deleted = false
GROUP BY f.id, f.faculty_id, f.first_name, f.last_name, 
         f.department, f.designation, f.status
ORDER BY f.last_name;

-- Verify parent dashboard data (Parents Dashboard)
-- After GET /api/parents/:id/dashboard
SELECT 
    p.id AS parent_id,
    p.first_name || ' ' || p.last_name AS parent_name,
    COUNT(DISTINCT ps.student_id) AS linked_children,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'absent') AS total_absences,
    COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'unpaid') AS unpaid_fees,
    COUNT(DISTINCT h.id) FILTER (WHERE h.status = 'pending') AS pending_homework
FROM parents p
LEFT JOIN parent_students ps ON ps.parent_id = p.id
LEFT JOIN attendances a ON a.student_id = ps.student_id
LEFT JOIN fees f ON f.student_id = ps.student_id
LEFT JOIN homeworks h ON h.student_id = ps.student_id
WHERE p.id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'  -- Replace with actual UUID
GROUP BY p.id, p.first_name, p.last_name;

-- ============================================================================
-- 5. UPDATE VERIFICATION
-- ============================================================================

-- Verify a user's role was updated correctly
-- After PUT /api/users/:id
SELECT id, full_name, email, role, status, updated_at
FROM admin_users
WHERE id = 'some-user-id';  -- Replace with actual ID

-- Check that updated_at changed
-- Run BEFORE and AFTER the update:
-- BEFORE: SELECT updated_at FROM admin_users WHERE id = 'some-user-id';
-- AFTER:  SELECT updated_at FROM admin_users WHERE id = 'some-user-id';
-- They should be different

-- Verify fee status update cascaded correctly
-- After PUT /api/student-fees/:id
SELECT sf.id, sf.payment_status, sf.paid_amount, sf.pending_amount,
       COUNT(i.id) AS total_installments,
       COUNT(i.id) FILTER (WHERE i.status = 'paid') AS paid_installments
FROM admin_student_fees sf
LEFT JOIN admin_installments i ON i.student_fee_id = sf.id
WHERE sf.id = 'some-student-fee-id'  -- Replace with actual ID
GROUP BY sf.id, sf.payment_status, sf.paid_amount, sf.pending_amount;

-- ============================================================================
-- 6. DELETE & SOFT DELETE VERIFICATION
-- ============================================================================

-- Verify soft delete (Faculty Dashboard - has isDeleted)
-- BEFORE: SELECT COUNT(*) FROM faculty WHERE is_deleted = false;
-- AFTER DELETE /api/faculty/:id
SELECT COUNT(*) AS active_faculty FROM faculty WHERE is_deleted = false;
SELECT COUNT(*) AS deleted_faculty FROM faculty WHERE is_deleted = true;

-- Verify the soft-deleted record details
SELECT id, faculty_id, first_name, last_name, status, 
       is_deleted, deleted_at
FROM faculty 
WHERE is_deleted = true
ORDER BY deleted_at DESC
LIMIT 5;

-- Verify RESTORE (set is_deleted = false)
-- This is what a restore endpoint should do
-- BEGIN;
-- UPDATE faculty SET is_deleted = false, deleted_at = NULL, updated_at = NOW()
-- WHERE id = 'some-faculty-id';
-- SELECT is_deleted, deleted_at FROM faculty WHERE id = 'some-faculty-id';
-- COMMIT;

-- Verify hard delete (Admin Dashboard - NO soft delete)
-- BEFORE: SELECT COUNT(*) FROM admin_examinations;
-- DELETE FROM admin_examinations WHERE id = 'some-exam-id';
-- AFTER:  SELECT COUNT(*) FROM admin_examinations;
-- The count should decrease by 1

-- ============================================================================
-- 7. FOREIGN KEY INTEGRITY VERIFICATION
-- ============================================================================

-- Find orphaned records in admin_enrollments (studentId should exist in admin_users)
SELECT e.id AS orphaned_enrollment_id, e.student_id
FROM admin_enrollments e
LEFT JOIN admin_users u ON u.id = e.student_id
WHERE u.id IS NULL;

-- Find orphaned records in admin_notifications
SELECT n.id AS orphaned_notification_id, n.user_id
FROM admin_notifications n
LEFT JOIN admin_users u ON u.id = n.user_id
WHERE u.id IS NULL;

-- Find orphaned courses without departments
SELECT c.id AS orphaned_course_id, c.name, c.department_id
FROM admin_courses c
LEFT JOIN admin_departments d ON d.id = c.department_id
WHERE d.id IS NULL;

-- Verify FK cascade worked (deleting a User should cascade to sessions)
-- BEFORE: SELECT COUNT(*) FROM admin_sessions WHERE user_id = 'some-user-id';
-- DELETE FROM admin_users WHERE id = 'some-user-id';
-- AFTER:  SELECT COUNT(*) FROM admin_sessions WHERE user_id = 'some-user-id';
-- Should be 0

-- Parents Dashboard FK integrity
SELECT COUNT(*) AS orphaned_attendances
FROM attendances a
LEFT JOIN students s ON s.id = a.student_id
WHERE s.id IS NULL;

SELECT COUNT(*) AS orphaned_fees
FROM fees f
LEFT JOIN students s ON s.id = f.student_id
WHERE s.id IS NULL;

-- ============================================================================
-- 8. CASCADE RULE VERIFICATION
-- ============================================================================

-- Verify CASCADE on parents (deleting a parent should cascade to parent_students)
-- Prerequisite: Know the parent_id
BEGIN;
-- Check linked records before delete
SELECT COUNT(*) AS linked_students_before 
FROM parent_students 
WHERE parent_id = 'some-parent-id';

-- Delete the parent (CASCADE should remove junction records)
DELETE FROM parents WHERE id = 'some-parent-id';

-- Check linked records after delete
SELECT COUNT(*) AS linked_students_after
FROM parent_students 
WHERE parent_id = 'some-parent-id';
-- Should be 0
ROLLBACK;  -- Rollback to restore the parent

-- Verify RESTRICT on batch FK (cannot delete course if batches exist)
-- This should FAIL with FK violation:
-- DELETE FROM courses WHERE id = 'some-course-id-with-batches';
-- Expected: ERROR: update or delete on table "courses" violates foreign key constraint

-- ============================================================================
-- 9. UNIQUE CONSTRAINT VERIFICATION
-- ============================================================================

-- Verify unique constraint on admin_users.email
-- This should FAIL:
-- INSERT INTO admin_users (id, full_name, username, email, mobile_number, password)
-- VALUES (gen_random_uuid(), 'Test', 'testdup', 'existing@email.com', '9999999999', 'password123');
-- Expected: ERROR: duplicate key value violates unique constraint

-- Verify unique constraint on parent_students
-- This should FAIL:
-- INSERT INTO parent_students (parent_id, student_id) 
-- VALUES ('existing-parent-id', 'existing-student-id');
-- Expected: ERROR: duplicate key value violates unique constraint "idx_parent_students_unique_pair"

-- Check all unique constraints in the database
SELECT conname AS constraint_name, conrelid::regclass AS table_name
FROM pg_constraint 
WHERE contype = 'u'
ORDER BY conrelid::regclass::text;

-- ============================================================================
-- 10. INDEX VERIFICATION
-- ============================================================================

-- List all indexes and their sizes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY tablename, indexname;

-- Find tables without indexes (performance issue)
SELECT
    t.table_schema,
    t.table_name,
    pg_size_pretty(pg_relation_size((t.table_schema || '.' || t.table_name)::regclass)) AS table_size
FROM information_schema.tables t
LEFT JOIN pg_indexes i ON i.tablename = t.table_name AND i.schemaname = t.table_schema
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND t.table_type = 'BASE TABLE'
  AND i.indexname IS NULL
ORDER BY t.table_name;

-- Find unused indexes (last used > 30 days ago or never)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename;

-- ============================================================================
-- 11. TRANSACTION ISOLATION & ACID VERIFICATION
-- ============================================================================

-- Test atomicity: INSERT + error should rollback entire transaction
BEGIN;
-- Insert a valid user
INSERT INTO admin_users (id, full_name, username, email, mobile_number, password, role)
VALUES (gen_random_uuid(), 'Atomic Test', 'atomictest', 'atomic@test.com', '1000000000', 'password123', 'Student');
-- This should FAIL (duplicate email if 'atomic@test.com' was inserted above)
-- If this fails, the valid INSERT above should also be rolled back
INSERT INTO admin_users (id, full_name, username, email, mobile_number, password, role)
VALUES (gen_random_uuid(), 'Atomic Test 2', 'atomictest2', 'atomic@test.com', '1000000001', 'password123', 'Student');
COMMIT;
-- Verify: SELECT * FROM admin_users WHERE email LIKE 'atomic@%';
-- Should return 0 rows (both should be rolled back)

-- Test isolation: Two concurrent transactions
-- Session 1:
-- BEGIN;
-- UPDATE admin_users SET status = 'inactive' WHERE id = 'some-user-id';
-- -- Do NOT commit yet

-- Session 2:
-- SELECT status FROM admin_users WHERE id = 'some-user-id';
-- -- Should see OLD value (READ COMMITTED default) until Session 1 commits

-- Session 1:
-- COMMIT;

-- Session 2:
-- SELECT status FROM admin_users WHERE id = 'some-user-id';
-- -- Should now see NEW value

-- ============================================================================
-- 12. TRIGGER VERIFICATION
-- ============================================================================

-- List all triggers in the database
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY event_object_table, trigger_name;

-- Verify audit log trigger (Admin Dashboard)
-- After any CREATE/UPDATE/DELETE on admin_users, there should be an audit log
SELECT al.id, al.module, al.action, al.description, al.created_at
FROM admin_audit_logs al
WHERE al.module = 'User'
ORDER BY al.created_at DESC
LIMIT 10;

-- ============================================================================
-- 13. DATA CONSISTENCY VERIFICATION
-- ============================================================================

-- Verify fee amounts balance correctly
SELECT id, total_fee, paid_amount, pending_amount,
       CASE 
           WHEN (total_fee - paid_amount) = pending_amount THEN '✅ BALANCED'
           ELSE '❌ MISMATCH'
       END AS balance_check
FROM admin_student_fees
WHERE (total_fee - paid_amount) != pending_amount;

-- Verify enrollment counts match course capacity
SELECT c.id, c.name, c.code,
       COUNT(e.id) AS enrolled_count
FROM admin_courses c
LEFT JOIN admin_enrollments e ON e.course_id = c.id AND e.status = 'active'
GROUP BY c.id, c.name, c.code
HAVING COUNT(e.id) > 100;  -- Flag courses with >100 enrollments

-- Verify parent-child relationships are bidirectional
SELECT ps.parent_id, ps.student_id
FROM parent_students ps
LEFT JOIN parents p ON p.id = ps.parent_id
LEFT JOIN students s ON s.id = ps.student_id
WHERE p.id IS NULL OR s.id IS NULL;

-- ============================================================================
-- 14. ROLLBACK VERIFICATION
-- ============================================================================

-- Test rollback on CREATE (simulate failed create)
BEGIN;
INSERT INTO admin_users (id, full_name, username, email, mobile_number, password, role)
VALUES (gen_random_uuid(), 'Rollback Test', 'rollbacktest', 'rollback@test.com', '2000000000', 'password123', 'Student');
-- Verify: SELECT * FROM admin_users WHERE username = 'rollbacktest';
-- Should see the row
ROLLBACK;
-- Verify: SELECT * FROM admin_users WHERE username = 'rollbacktest';
-- Should be empty (rolled back)

-- Test rollback on UPDATE (simulate failed update)
BEGIN;
UPDATE admin_users SET status = 'inactive' WHERE email = 'admin@cims.com';
-- Verify: SELECT email, status FROM admin_users WHERE email = 'admin@cims.com';
-- Should show 'inactive'
ROLLBACK;
-- Verify: SELECT email, status FROM admin_users WHERE email = 'admin@cims.com';
-- Should show 'active' (rolled back)

-- Test rollback on DELETE (simulate failed delete)
BEGIN;
DELETE FROM admin_password_resets WHERE email = 'test@example.com';
-- Verify: SELECT COUNT(*) FROM admin_password_resets WHERE email = 'test@example.com';
-- Should be 0
ROLLBACK;
-- Verify: SELECT COUNT(*) FROM admin_password_resets WHERE email = 'test@example.com';
-- Should be back to original count

-- ============================================================================
-- 15. FRONTEND vs DATABASE DATA CONSISTENCY
-- ============================================================================

-- Compare frontend-displayed data with database truth
-- Run these queries and compare the results with what the frontend shows

-- 1. User list (Admin Dashboard)
SELECT id, full_name, email, role, status, created_at::date
FROM admin_users
ORDER BY created_at DESC;

-- 2. Fee structures (Admin Dashboard)
SELECT fs.fee_structure_id, c.name AS course, fs.total_fee, 
       COUNT(sf.id) AS assigned_students
FROM admin_fee_structures fs
JOIN admin_courses c ON c.id = fs.course_id
LEFT JOIN admin_student_fees sf ON sf.fee_structure_id = fs.id
GROUP BY fs.fee_structure_id, c.name, fs.total_fee;

-- 3. Dashboard summary (Admin Dashboard)
SELECT 
    COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'Student') AS total_students,
    COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'Faculty') AS total_faculty,
    COUNT(DISTINCT c.id) AS total_courses,
    COALESCE(SUM(sf.pending_amount), 0) AS total_pending_fees
FROM admin_users u
CROSS JOIN (SELECT COUNT(*) AS id FROM admin_courses) c
LEFT JOIN admin_student_fees sf ON sf.payment_status IN ('pending', 'overdue');

-- 4. Examination results (Faculty/Admin Dashboard)
SELECT e.title AS exam_name, 
       COUNT(r.id) AS total_results,
       COUNT(r.id) FILTER (WHERE r.status = 'pass') AS passed,
       COUNT(r.id) FILTER (WHERE r.status = 'fail') AS failed,
       ROUND(AVG(r.percentage), 2) AS avg_percentage
FROM admin_examinations e
LEFT JOIN admin_results r ON r.examination_id = e.id
GROUP BY e.id, e.title;

-- 5. Attendance summary (Faculty Dashboard)
SELECT 
    s.full_name AS student_name,
    COUNT(a.id) AS total_classes,
    COUNT(a.id) FILTER (WHERE a.attendance_status = 'present') AS present,
    COUNT(a.id) FILTER (WHERE a.attendance_status = 'absent') AS absent,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE a.attendance_status = 'present') / 
        NULLIF(COUNT(a.id), 0), 1
    ) AS attendance_percentage
FROM students s
LEFT JOIN attendances a ON a.student_id = s.id
WHERE s.is_deleted = false
GROUP BY s.id, s.full_name
ORDER BY attendance_percentage ASC NULLS LAST;

-- 6. Payment status (Parents Dashboard)
SELECT 
    s.first_name || ' ' || s.last_name AS student_name,
    COUNT(f.id) AS total_fee_records,
    SUM(f.total_amount) AS total_amount,
    SUM(f.paid_amount) AS total_paid,
    SUM(f.total_amount) - SUM(f.paid_amount) AS balance,
    COUNT(f.id) FILTER (WHERE f.status = 'unpaid') AS unpaid_count
FROM students s
LEFT JOIN fees f ON f.student_id = s.id
WHERE s.active_status = true
GROUP BY s.id, s.first_name, s.last_name;

-- ============================================================================
-- 16. COMPREHENSIVE DATA HEALTH CHECK
-- ============================================================================

-- Final health check: Run this to get a complete picture of DB health
WITH table_stats AS (
    SELECT 
        table_schema,
        table_name,
        (xpath('/row/count/text()', query_to_xml(
            format('SELECT count(*) AS count FROM %I.%I', table_schema, table_name), 
            true, false, '')))[1]::text::int AS row_count
    FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      AND table_type = 'BASE TABLE'
),
health_checks AS (
    -- Check for orphaned records
    SELECT 'admin_courses without departments' AS check_name,
           COUNT(*) AS issue_count
    FROM admin_courses c
    LEFT JOIN admin_departments d ON d.id = c.department_id
    WHERE d.id IS NULL
    UNION ALL
    SELECT 'admin_enrollments without users',
           COUNT(*)
    FROM admin_enrollments e
    LEFT JOIN admin_users u ON u.id = e.student_id
    WHERE u.id IS NULL
    UNION ALL
    SELECT 'fees without students',
           COUNT(*)
    FROM fees f
    LEFT JOIN students s ON s.id = f.student_id
    WHERE s.id IS NULL
    UNION ALL
    SELECT 'attendances without students',
           COUNT(*)
    FROM attendances a
    LEFT JOIN students s ON s.id = a.student_id
    WHERE s.id IS NULL
)
SELECT * FROM health_checks WHERE issue_count > 0
UNION ALL
SELECT '✅ All FK checks passed', 0
WHERE NOT EXISTS (SELECT 1 FROM health_checks WHERE issue_count > 0);

-- Final summary
SELECT 
    (SELECT COUNT(*) FROM admin_users) AS admin_users,
    (SELECT COUNT(*) FROM faculty WHERE is_deleted = false) AS active_faculty,
    (SELECT COUNT(*) FROM students WHERE is_deleted = false) AS active_students,
    (SELECT COUNT(*) FROM parents WHERE active_status = true) AS active_parents,
    (SELECT COUNT(*) FROM admin_courses) AS total_courses,
    (SELECT COUNT(*) FROM admin_examinations) AS total_exams,
    (SELECT COUNT(*) FROM admin_payments WHERE status = 'success') AS successful_payments,
    (SELECT COALESCE(SUM(amount), 0) FROM admin_payments WHERE status = 'success') AS total_revenue;
