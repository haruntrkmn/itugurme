import psycopg2 as dbapi2
from passlib.hash import pbkdf2_sha256 as hasher

class Database:
    def __init__(self, host="", user="", password="", dbname=""):
        self.host = host
        self.user = user
        self.password = password
        self.db = dbname

    def signup(self,username,password_):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            password_ = hasher.hash(password_)
            try:
                statement = """INSERT INTO users(username,password_) VALUES(%s,%s)"""
                cursor.execute(statement,(username,password_))
                connection.commit()
                cursor.close()
            except dbapi2.IntegrityError:
                connection.rollback()
                return False
        return True
    def signin(self, username,password_):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            statement = """SELECT password_ FROM users WHERE username = %s"""
            cursor.execute(statement,(username,))
            fetch = cursor.fetchall()
            if len(fetch) > 0:
                if(hasher.verify(password_, fetch[0][0])):
                    return True
            return False

    def truncate_meals(self):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            statement = """TRUNCATE meals"""
            cursor.execute(statement)
            return True

    def insert_food(self, food_name):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            connection.set_client_encoding('UTF8')
            cursor = connection.cursor()
            try:
                statement = """INSERT INTO foods(food_name) VALUES(%s)"""
                cursor.execute(statement, (food_name,))
                connection.commit()
                cursor.close()
            except dbapi2.IntegrityError:
                connection.rollback()
            cursor = connection.cursor()
            try:
                statement = """INSERT INTO meals(food_name, isLunch) VALUES(%s, %s)"""
                cursor.execute(statement, (food_name, True))
                connection.commit()
                cursor.close()
            except dbapi2.IntegrityError:
                connection.rollback()
                return False
        return True
    
    def vote(self, username, vote, food_name):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            statement = """SELECT vote_id FROM votes WHERE food_name = %s and username = %s and vote_date = CURRENT_DATE"""
            cursor.execute(statement,(food_name, username))
            fetch = cursor.fetchall()
            if(len(fetch) > 0):
                try:
                    statement = """UPDATE votes SET vote = %s WHERE vote_id = %s;"""
                    cursor.execute(statement, (vote, fetch[0][0]))
                    connection.commit()
                    cursor.close()
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            else:
                try:
                    statement = """INSERT INTO votes(username, vote, food_name) VALUES(%s, %s, %s)"""
                    cursor.execute(statement, (username, vote, food_name))
                    connection.commit()
                    cursor.close()
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            return True

    def comment(self, username, text_, food_name):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            statement = """SELECT comment_id FROM comments WHERE food_name = %s and username = %s and comment_date = CURRENT_DATE"""
            cursor.execute(statement,(food_name, username))
            fetch = cursor.fetchall()
            if(len(fetch) > 0):
                try:
                    statement = """UPDATE comments SET text_ = %s WHERE comment_id = %s;"""
                    cursor.execute(statement, (text_, fetch[0][0],))
                    connection.commit()
                    cursor.close()
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            else:
                try:
                    statement = """INSERT INTO comments(username, text_, food_name) VALUES(%s, %s, %s)"""
                    cursor.execute(statement, (username, text_, food_name))
                    connection.commit()
                    cursor.close()
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            return True
    
    def get_gurme_score(self, username, connection):
        cursor = connection.cursor()
        statement = """SELECT gurme_score FROM users WHERE username = %s"""
        cursor.execute(statement,(username,))
        return cursor.fetchall()[0][0]
    
    def get_food_comments(self, food_name ,isAll, username):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            if(not isAll):
                statement = """select * from comments where food_name = %s and comment_date = CURRENT_DATE order by comment_score desc"""
            else:
                statement = """select * from comments where food_name = %s order by comment_score desc"""
            cursor.execute(statement,(food_name,))
            fetch = cursor.fetchall()
            comments = []
            i = 0
            n = cursor.rowcount
            while(i < n):
                gurme_point = self.get_gurme_score(fetch[i][3], connection)
                liked, disliked = self.get_comment_isLiked(username, fetch[i][0] ,connection)
                comments.append({"commenter":fetch[i][3], "gurmeScore":gurme_point, "text":fetch[i][1],"score":fetch[i][5], "commentId":fetch[i][0], "isLiked":liked, "isDisliked":disliked})
                i+=1
            cursor.close()
            return comments
    
    def get_comment_isLiked(self, username, comment_id, connection):
        cursor = connection.cursor()
        statement = """SELECT isliked FROM comment_votes WHERE username = %s and comment_id = %s"""
        cursor.execute(statement,(username,comment_id))
        fetch = cursor.fetchall()
        isliked = False
        disliked = False
        if(len(fetch) > 0):
            if(fetch[0][0] is True):
                isliked = True
            else:
                disliked = True
        cursor.close()
        return isliked, disliked
    
    def get_meal(self, connection):
        cursor = connection.cursor()
        statement = """SELECT foods.food_name FROM foods INNER JOIN meals ON foods.food_name = meals.food_name ORDER BY foods.food_name DESC LIMIT 5"""
        cursor.execute(statement)
        fetch = cursor.fetchall()
        i = 0
        foods = []
        while(i < len(fetch)):
            statement = """SELECT AVG(vote) FROM foods INNER JOIN votes ON foods.food_name = votes.food_name WHERE foods.food_name = %s;"""
            cursor.execute(statement, (fetch[i][0],))
            average_rate = cursor.fetchall()[0][0]
            if(average_rate is None):
                average_rate = 0
            round(average_rate, 1)
            statement = """SELECT COUNT(*) FROM foods INNER JOIN comments ON foods.food_name = comments.food_name WHERE foods.food_name = %s and comments.comment_date = CURRENT_DATE;"""
            cursor.execute(statement, (fetch[i][0],))
            comment_count = cursor.fetchall()[0][0]
            foods.append({"name":fetch[i][0], "score":float(average_rate), "commentCount":comment_count})
            i+=1
        statement = """SELECT islunch FROM meals LIMIT 1"""
        cursor.execute(statement)
        isLunch = cursor.fetchall()[0][0]
        cursor.close()
        return foods, isLunch
    
    def get_user_information(self, username, connection):
        cursor = connection.cursor()
        statement = """SELECT * FROM votes WHERE username = %s and vote_date = CURRENT_DATE"""
        cursor.execute(statement,(username,))
        fetch = cursor.fetchall()
        i = 0
        votes = []
        while(i < cursor.rowcount):
            votes.append({"vote":fetch[i][1], "foodName":fetch[i][2]})
            i+=1
        cursor.close()        
        return votes

    def get_homepage_infos(self,username,connection = None):
        if connection is None:
            connection = dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db)
        with connection:
            votes = self.get_user_information(username, connection)
            foods, isLunch = self.get_meal(connection)
            return votes,foods,isLunch

    def update_comment_score(self,comment_id, operation, connection):
        cursor = connection.cursor()
        try:
            statement = """UPDATE comments SET comment_score = comment_score + %s WHERE comment_id = %s"""
            cursor.execute(statement, (operation,comment_id,))
            connection.commit()
            cursor.close()
            return True
        except dbapi2.IntegrityError:
            connection.rollback()
            return False
    
    def update_gurmescore(self,username,operation, connection):
        cursor = connection.cursor()
        try:
            statement = """UPDATE users SET gurme_score = gurme_score + %s WHERE username = %s"""
            cursor.execute(statement, (operation, username,))
            connection.commit()
            cursor.close()
            return True
        except dbapi2.IntegrityError:
            connection.rollback()
            return False
    
    def comment_vote(self, comment_id, user, operation, commenter, connection = None):
        with dbapi2.connect(host=self.host, user=self.user, password=self.password, dbname=self.db) as connection:
            cursor = connection.cursor()
            if(operation == "unlike" or operation == "undislike"):
                try:
                    statement = """DELETE FROM comment_votes WHERE comment_id = %s and username = %s;"""
                    cursor.execute(statement, (comment_id, user))
                    connection.commit()
                    cursor.close()
                    if(operation == "unlike"):
                        operation = -1
                    else:
                        operation = +1
                    self.update_comment_score(comment_id, operation, connection)
                    self.update_gurmescore(commenter,operation,connection)
                    return "Oy silindi"
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            if(operation == "dislike"):
                operation = False
            elif(operation == "like"):
                operation = True
            statement = """SELECT comment_vote_id FROM comment_votes WHERE comment_id = %s and username = %s"""
            cursor.execute(statement,(comment_id, user))
            fetch = cursor.fetchall()
            if(len(fetch) > 0):
                try:
                    statement = """UPDATE comment_votes SET isliked = %s WHERE comment_vote_id = %s;"""
                    cursor.execute(statement, (operation, fetch[0][0]))
                    connection.commit()
                    cursor.close()
                    if(operation):
                        operation = 2
                    else:
                        operation = -2
                    self.update_comment_score(comment_id, operation, connection)
                    self.update_gurmescore(commenter,operation,connection)
                    return "Oy güncellendi"
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            else:
                try:
                    statement = """INSERT INTO comment_votes(comment_id ,username, isliked) VALUES(%s, %s, %s)"""
                    cursor.execute(statement, (comment_id, user, operation,))
                    connection.commit()
                    cursor.close()
                    if(operation):
                        operation = 1
                    else:
                        operation = -1
                    self.update_comment_score(comment_id, operation, connection)
                    self.update_gurmescore(commenter,operation,connection)
                    return "Oy verildi"
                except dbapi2.IntegrityError:
                    connection.rollback()
                    return False
            return True
