DO $$
DECLARE
    v_mod_id UUID;
    v_cat_id UUID;
    v_class_id UUID;
BEGIN
    -- Assignment: Topic A Quiz (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic A Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic B Quiz (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic B Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic C Quiz (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic C Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic D Quiz (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic D Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic E Quiz (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic E Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Module 1 Assessment (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Module 1 Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Multiplication Pre-Test (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Multiplication Pre-Test', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic A Quiz (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic A Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic B Quiz (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic B Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic C Quiz (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic C Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Perimeter & Area (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Perimeter & Area', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Topic E Quiz (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Topic E Quiz', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Module 2 Assessment (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Module 2 Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Trimester 1 Assessment (Math - Module 2)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 2';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Trimester 1 Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 10/29 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('10/29', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/5 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/5', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/6 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/6', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/10 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/10', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/12 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/12', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/13 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/13', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/14 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/14', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/17 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/17', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/18 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/18', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 11/19 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('11/19', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 12/1 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('12/1', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 12/9 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('12/9', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 12/11 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('12/11', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 1/20 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('1/20', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 1/21 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('1/21', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 1/22 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('1/22', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 1/28 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('1/28', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: 1/29 (Math - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Math';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('1/29', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Memory pg. 3 (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Memory pg. 3', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: A Good Friend pg. 19 (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('A Good Friend pg. 19', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Cause and Effect pg. 26 (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Cause and Effect pg. 26', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Food Narrative pg. 59 (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Food Narrative pg. 59', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Simile Monster (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Simile Monster', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Haunted House (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Haunted House', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Personal Narrative (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Personal Narrative', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Ch. 2 Medieval (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Ch. 2 Medieval', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Ch. 4 Medieval (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Ch. 4 Medieval', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Medieval Opinion (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Medieval Opinion', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Ch. 7 Medieval (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Ch. 7 Medieval', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Ch. 8 Medieval (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Ch. 8 Medieval', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Ch. 9 Medieval (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Ch. 9 Medieval', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Polio Comprehension Questions pg. 127 (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Polio Comprehension Questions pg. 127', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Unit 1 Reading Comprehension (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Unit 1 Reading Comprehension', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Wild, Wild Weather (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Wild, Wild Weather', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Firsthand vs. Secondhand (English - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'English';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Firsthand vs. Secondhand', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Experience 2 (Science - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Science';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Experience 2', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Experience 3 (Science - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Science';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Homework';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Experience 3', 100, v_mod_id, v_cat_id, 1, NOW());

    -- Assignment: Unit Assessment (Science - Module 1)
    SELECT id INTO v_class_id FROM classes WHERE name = 'Science';
    SELECT id INTO v_mod_id FROM modules WHERE class_id = v_class_id AND name = 'Module 1';
    SELECT id INTO v_cat_id FROM categories WHERE class_id = v_class_id AND name = 'Assessment';
    INSERT INTO assignments (name, max_points, module_id, category_id, trimester, due_date)
    VALUES ('Unit Assessment', 100, v_mod_id, v_cat_id, 1, NOW());

END $$;