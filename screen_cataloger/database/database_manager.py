import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional

class DatabaseManager:
    def __init__(self, db_path: str = "database/captures.db"):
        self.db_path = db_path
        self.ensure_directory_exists()
        self.init_database()
    
    def ensure_directory_exists(self):
        """Ensure the database directory exists"""
        directory = os.path.dirname(self.db_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
    
    def init_database(self):
        """Initialize the database with required tables"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Create captures table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS captures (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    filepath TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    extracted_text TEXT,
                    tags TEXT,
                    category TEXT,
                    application TEXT,
                    window_title TEXT,
                    width INTEGER,
                    height INTEGER,
                    file_size INTEGER
                )
            ''')
            
            # Create tags table for better organization
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tag_name TEXT UNIQUE NOT NULL,
                    color TEXT,
                    description TEXT
                )
            ''')
            
            # Create categories table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    auto_keywords TEXT
                )
            ''')
            
            conn.commit()
    
    def add_capture(self, filename: str, filepath: str, extracted_text: str = "", 
                   tags: str = "", category: str = "", application: str = "",
                   window_title: str = "", width: int = 0, height: int = 0, 
                   file_size: int = 0) -> int:
        """Add a new capture to the database"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO captures 
                (filename, filepath, extracted_text, tags, category, application, 
                 window_title, width, height, file_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (filename, filepath, extracted_text, tags, category, application,
                  window_title, width, height, file_size))
            conn.commit()
            return cursor.lastrowid
    
    def search_captures(self, query: str, category: str = "", tags: str = "") -> List[Dict]:
        """Search captures by text content, category, or tags"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            where_conditions = []
            params = []
            
            if query:
                where_conditions.append("(extracted_text LIKE ? OR filename LIKE ? OR window_title LIKE ?)")
                query_param = f"%{query}%"
                params.extend([query_param, query_param, query_param])
            
            if category:
                where_conditions.append("category = ?")
                params.append(category)
            
            if tags:
                where_conditions.append("tags LIKE ?")
                params.append(f"%{tags}%")
            
            where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
            
            cursor.execute(f'''
                SELECT * FROM captures 
                WHERE {where_clause}
                ORDER BY timestamp DESC
            ''', params)
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    def get_all_categories(self) -> List[str]:
        """Get all unique categories"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT category FROM captures WHERE category != ''")
            return [row[0] for row in cursor.fetchall()]
    
    def get_all_tags(self) -> List[str]:
        """Get all unique tags"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT tags FROM captures WHERE tags != ''")
            all_tags = []
            for row in cursor.fetchall():
                if row[0]:
                    all_tags.extend([tag.strip() for tag in row[0].split(',')])
            return list(set(all_tags))
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM captures")
            total_captures = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(DISTINCT category) FROM captures WHERE category != ''")
            total_categories = cursor.fetchone()[0]
            
            cursor.execute("SELECT SUM(file_size) FROM captures")
            total_size = cursor.fetchone()[0] or 0
            
            return {
                "total_captures": total_captures,
                "total_categories": total_categories,
                "total_size_bytes": total_size,
                "total_size_mb": round(total_size / (1024 * 1024), 2)
            }