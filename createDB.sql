CREATE TABLE "t_library" (
	"id" serial NOT NULL,
	"name" character varying NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "t_book" (
	"id" serial NOT NULL,
    "library_id" integer ,
	"name" character varying NOT NULL,
	"author" character varying NOT NULL,
	"title" character varying NOT NULL,
	"score" DECIMAL(10) DEFAULT '2',
    "reader_count" integer NOT NULL,
	"is_active" boolean NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "t_user" (
	"id" serial NOT NULL,
    "library_id" integer ,
	"name" character varying NOT NULL,
	"surname" character varying NOT NULL,
	"is_active" boolean NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "t_bb_history" (
	"id" serial NOT NULL,
	"user_id"  integer NOT NULL,
	"book_id"  integer NOT NULL,
	"past" json ,
	"present" json ,
	PRIMARY KEY ("id")
);


ALTER TABLE "t_book" ADD CONSTRAINT "t_book_fk1" FOREIGN KEY ("library_id") REFERENCES "t_library"("id");
ALTER TABLE "t_user" ADD CONSTRAINT "t_user_fk1" FOREIGN KEY ("library_id") REFERENCES "t_library"("id");
ALTER TABLE "t_bb_history" ADD CONSTRAINT "t_bb_history_fk1" FOREIGN KEY ("user_id") REFERENCES "t_user"("id");

ALTER TABLE "t_bb_history" ADD CONSTRAINT "t_bb_history_fk2" FOREIGN KEY ("book_id") REFERENCES "t_book"("id");