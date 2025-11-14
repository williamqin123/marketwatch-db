SELECT user_id, first_name, last_name, email, created_at
FROM User
WHERE user_id = %(id)s;