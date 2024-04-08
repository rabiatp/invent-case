create or replace view v_user_list as 
SELECT 
    users.id as user_id,
    users.name,
    users.surname,
    library.id
FROM t_user users
JOIN t_library library ON library.id = users.library_id;

create or replace view v_book_list as 
SELECT 
    book.id as user_id,
    book.name,
    book.author,
	book.score,
    library.id
FROM t_book book
JOIN t_library library ON library.id = book.library_id;
