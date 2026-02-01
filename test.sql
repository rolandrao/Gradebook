DO $$
DECLARE
    v_mod_id UUID;
    v_cat_id UUID;
    v_class_id UUID;
    
    -- Helper function-like logic for category selection
    -- Math Categories: Assessments, Exit Tickets, Quizzes
BEGIN
    -- 1. Clear the assignments table
    DELETE FROM assignments;

    -- MATH MODULE 1
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    
    -- Quizzes
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Quizzes';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('Topic A Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic B Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic C Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic D Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic E Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assessments
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessments';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Module 1 Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Exit Tickets (Assignments with dates as names)
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Exit Tickets';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('10/29', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/5', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/6', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/10', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/12', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/13', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/14', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/17', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/18', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('11/19', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('12/1', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('12/9', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('12/11', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('1/20', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('1/21', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('1/22', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('1/28', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('1/29', 100, v_mod_id, v_cat_id, 1, NOW());

    -- MATH MODULE 2
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    
    -- Quizzes
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Quizzes';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('Topic A Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic B Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic C Quiz', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Topic E Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assessments
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessments';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('Multiplication Pre-Test', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Module 2 Assessment', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Trimester 1 Assessment', 100, v_mod_id, v_cat_id, 1, NOW());
    
    -- General Category for non-math specific items (e.g., Perimeter & Area)
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessments'; 
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Perimeter & Area', 100, v_mod_id, v_cat_id, 1, NOW());

    -- ENGLISH MODULE 1
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('Memory pg. 3', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('A Good Friend pg. 19', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Cause and Effect pg. 26', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Food Narrative pg. 59', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Simile Monster', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Haunted House', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Personal Narrative', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Ch. 2 Medieval', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Ch. 4 Medieval', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Medieval Opinion', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Ch. 7 Medieval', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Ch. 8 Medieval', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Ch. 9 Medieval', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Polio Comprehension Questions pg. 127', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Unit 1 Reading Comprehension', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Wild, Wild Weather', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Firsthand vs. Secondhand', 100, v_mod_id, v_cat_id, 1, NOW());

    -- SCIENCE MODULE 1
    SELECT id INTO v_class_id FROM classes WHERE name = 'Science';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date) VALUES 
    ('Experience 2', 100, v_mod_id, v_cat_id, 1, NOW()),
    ('Experience 3', 100, v_mod_id, v_cat_id, 1, NOW());

    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Unit Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

END $$;