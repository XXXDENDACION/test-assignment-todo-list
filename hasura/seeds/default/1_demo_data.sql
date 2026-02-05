-- Demo user (password: "password123" - bcrypt 12 rounds)
-- To generate a new hash: node -e "require('bcrypt').hash('yourpassword', 12).then(h => console.log(h))"
INSERT INTO users (id, email, name, password_hash) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'demo@example.com', 'Demo User', '$2b$12$6JoYQ1F0xMThfrCF4ZoMIO4DWOV56DkUsHnOcpS0KuvRegBRcvTRS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, password_hash) VALUES
    ('c1f7a4e9-1c9c-4f1a-b3e3-7b1a2c3d4e5f', 'test@example.com', 'Test User', '$2b$16$R9lSfwREAmj9XdosBW5uAOpgeKo0dPlDS9ZNIzIf5bpJ6YyjdOJlO')
ON CONFLICT (id) DO NOTHING;

-- Terms of Service document
INSERT INTO tos_documents (version, content)
SELECT '1.0', E'# Terms of Service\n\n## 1. Acceptance of Terms\n\nBy accessing and using this Task Management application, you accept and agree to be bound by the terms and provision of this agreement.\n\n## 2. Description of Service\n\nThe Service provides task management functionality allowing users to create, read, update, and delete tasks.\n\n## 3. User Account\n\nYou are responsible for maintaining the confidentiality of your account credentials.\n\n## 4. Privacy Policy\n\nYour privacy is important to us. Your data will be stored securely.\n\n## 5. Contact\n\nFor questions, please contact support@example.com.'
WHERE NOT EXISTS (SELECT 1 FROM tos_documents LIMIT 1);

-- FAQ items
INSERT INTO faq_items (question, answer, order_index)
SELECT 'How do I create a new task?', 'Click the "New Task" button, fill in the title and description, then click "Create Task".', 1
WHERE NOT EXISTS (SELECT 1 FROM faq_items WHERE order_index = 1);

INSERT INTO faq_items (question, answer, order_index)
SELECT 'Can I edit my tasks?', 'Yes! Click on the edit icon next to any task to modify it.', 2
WHERE NOT EXISTS (SELECT 1 FROM faq_items WHERE order_index = 2);

INSERT INTO faq_items (question, answer, order_index)
SELECT 'How do I delete a task?', 'Click the delete icon next to the task. You will be asked to confirm.', 3
WHERE NOT EXISTS (SELECT 1 FROM faq_items WHERE order_index = 3);

INSERT INTO faq_items (question, answer, order_index)
SELECT 'Is my data secure?', 'Yes, your data is stored securely and each user can only access their own tasks.', 4
WHERE NOT EXISTS (SELECT 1 FROM faq_items WHERE order_index = 4);

INSERT INTO faq_items (question, answer, order_index)
SELECT 'How do I log out?', 'Click on your profile icon in the navigation bar and select "Sign Out".', 5
WHERE NOT EXISTS (SELECT 1 FROM faq_items WHERE order_index = 5);
