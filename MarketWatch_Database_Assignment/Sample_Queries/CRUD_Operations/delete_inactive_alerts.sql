-- DELETE Operation: Remove inactive alerts that have been triggered
-- This query demonstrates DELETE with a WHERE clause to remove specific records

DELETE FROM Alert
WHERE is_active = FALSE
  AND triggered_at IS NOT NULL;

-- Verify deletion
SELECT COUNT(*) AS remaining_inactive_triggered_alerts
FROM Alert
WHERE is_active = FALSE AND triggered_at IS NOT NULL;
