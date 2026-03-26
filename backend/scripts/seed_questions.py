from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.db.session import SessionLocal
from app.models.question import Question

QUESTIONS = [
 
    # ─────────────────────────────────────────
    # MATHEMATICS  (subject = "mathematics")
    # ─────────────────────────────────────────
    {
        "subject": "mathematics",
        "question_text_en": "What is the value of 12 × 15?",
        "question_text_uz": "12 × 15 ning qiymati nechaga teng?",
        "options_en": ["170", "180", "175", "185"],
        "options_uz": ["170", "180", "175", "185"],
        "correct_answer_index": 1,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is the square root of 144?",
        "question_text_uz": "144 ning kvadrat ildizi qancha?",
        "options_en": ["11", "12", "13", "14"],
        "options_uz": ["11", "12", "13", "14"],
        "correct_answer_index": 1,
    },
    {
        "subject": "mathematics",
        "question_text_en": "If x + 7 = 15, what is x?",
        "question_text_uz": "Agar x + 7 = 15 bo'lsa, x nechaga teng?",
        "options_en": ["6", "7", "8", "9"],
        "options_uz": ["6", "7", "8", "9"],
        "correct_answer_index": 2,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is 25% of 200?",
        "question_text_uz": "200 ning 25 foizi qancha?",
        "options_en": ["40", "45", "50", "55"],
        "options_uz": ["40", "45", "50", "55"],
        "correct_answer_index": 2,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is the area of a rectangle with length 8 and width 5?",
        "question_text_uz": "Uzunligi 8 va eni 5 bo'lgan to'g'ri to'rtburchakning yuzi qancha?",
        "options_en": ["35", "40", "45", "30"],
        "options_uz": ["35", "40", "45", "30"],
        "correct_answer_index": 1,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is the value of 2³ + 3²?",
        "question_text_uz": "2³ + 3² ning qiymati qancha?",
        "options_en": ["15", "16", "17", "18"],
        "options_uz": ["15", "16", "17", "18"],
        "correct_answer_index": 2,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is the least common multiple (LCM) of 4 and 6?",
        "question_text_uz": "4 va 6 ning eng kichik umumiy karrali (EKUK) qancha?",
        "options_en": ["8", "10", "12", "24"],
        "options_uz": ["8", "10", "12", "24"],
        "correct_answer_index": 2,
    },
    {
        "subject": "mathematics",
        "question_text_en": "A triangle has angles of 60° and 80°. What is the third angle?",
        "question_text_uz": "Uchburchakning ikki burchagi 60° va 80°. Uchinchi burchak necha daraja?",
        "options_en": ["30°", "40°", "50°", "60°"],
        "options_uz": ["30°", "40°", "50°", "60°"],
        "correct_answer_index": 1,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is the perimeter of a square with side length 9?",
        "question_text_uz": "Tomoni 9 bo'lgan kvadratning perimetri qancha?",
        "options_en": ["27", "36", "45", "81"],
        "options_uz": ["27", "36", "45", "81"],
        "correct_answer_index": 1,
    },
    {
        "subject": "mathematics",
        "question_text_en": "What is 3/4 expressed as a decimal?",
        "question_text_uz": "3/4 ni o'nli kasr sifatida ifodalang.",
        "options_en": ["0.25", "0.5", "0.75", "0.8"],
        "options_uz": ["0.25", "0.5", "0.75", "0.8"],
        "correct_answer_index": 2,
    },
 
    # ─────────────────────────────────────────
    # ENGLISH  (subject = "english")
    # ─────────────────────────────────────────
    {
        "subject": "english",
        "question_text_en": "Which word is a synonym for 'happy'?",
        "question_text_uz": "'Happy' so'zining sinonimi qaysi?",
        "options_en": ["Sad", "Joyful", "Angry", "Tired"],
        "options_uz": ["G'amgin", "Xursand", "G'azablangan", "Charchagan"],
        "correct_answer_index": 1,
    },
    {
        "subject": "english",
        "question_text_en": "Choose the correct form: 'She ___ to school every day.'",
        "question_text_uz": "To'g'ri shaklni tanlang: 'She ___ to school every day.'",
        "options_en": ["go", "goes", "going", "gone"],
        "options_uz": ["go", "goes", "going", "gone"],
        "correct_answer_index": 1,
    },
    {
        "subject": "english",
        "question_text_en": "What is the plural of 'child'?",
        "question_text_uz": "'Child' so'zining ko'pligi qanday?",
        "options_en": ["Childs", "Childes", "Children", "Childrens"],
        "options_uz": ["Childs", "Childes", "Children", "Childrens"],
        "correct_answer_index": 2,
    },
    {
        "subject": "english",
        "question_text_en": "Which sentence is grammatically correct?",
        "question_text_uz": "Qaysi gap grammatik jihatdan to'g'ri?",
        "options_en": [
            "He don't like coffee.",
            "He doesn't likes coffee.",
            "He doesn't like coffee.",
            "He not like coffee.",
        ],
        "options_uz": [
            "He don't like coffee.",
            "He doesn't likes coffee.",
            "He doesn't like coffee.",
            "He not like coffee.",
        ],
        "correct_answer_index": 2,
    },
    {
        "subject": "english",
        "question_text_en": "What does the word 'enormous' mean?",
        "question_text_uz": "'Enormous' so'zi nima degan ma'noni anglatadi?",
        "options_en": ["Very small", "Very fast", "Very large", "Very old"],
        "options_uz": ["Juda kichik", "Juda tez", "Juda katta", "Juda eski"],
        "correct_answer_index": 2,
    },
    {
        "subject": "english",
        "question_text_en": "Which is the past tense of 'write'?",
        "question_text_uz": "'Write' fe'lining o'tgan zamoni qaysi?",
        "options_en": ["Writed", "Written", "Wrote", "Wrotes"],
        "options_uz": ["Writed", "Written", "Wrote", "Wrotes"],
        "correct_answer_index": 2,
    },
    {
        "subject": "english",
        "question_text_en": "What part of speech is the word 'quickly'?",
        "question_text_uz": "'Quickly' so'zi nutqning qaysi qismiga kiradi?",
        "options_en": ["Noun", "Adjective", "Verb", "Adverb"],
        "options_uz": ["Ot", "Sifat", "Fe'l", "Ravish"],
        "correct_answer_index": 3,
    },
    {
        "subject": "english",
        "question_text_en": "Choose the correct article: '___ apple a day keeps the doctor away.'",
        "question_text_uz": "To'g'ri artiklni tanlang: '___ apple a day keeps the doctor away.'",
        "options_en": ["A", "An", "The", "No article"],
        "options_uz": ["A", "An", "The", "Artikl kerak emas"],
        "correct_answer_index": 1,
    },
    {
        "subject": "english",
        "question_text_en": "What is the antonym of 'ancient'?",
        "question_text_uz": "'Ancient' so'zining antonimi qaysi?",
        "options_en": ["Old", "Modern", "Historic", "Aged"],
        "options_uz": ["Eski", "Zamonaviy", "Tarixiy", "Qadimiy"],
        "correct_answer_index": 1,
    },
    {
        "subject": "english",
        "question_text_en": "Which sentence uses the present perfect correctly?",
        "question_text_uz": "Qaysi gapda present perfect to'g'ri ishlatilgan?",
        "options_en": [
            "I have saw that movie.",
            "I have seen that movie.",
            "I has seen that movie.",
            "I seen that movie.",
        ],
        "options_uz": [
            "I have saw that movie.",
            "I have seen that movie.",
            "I has seen that movie.",
            "I seen that movie.",
        ],
        "correct_answer_index": 1,
    },
 
    # ─────────────────────────────────────────
    # NATURAL SCIENCE  (subject = "science")
    # ─────────────────────────────────────────
    {
        "subject": "science",
        "question_text_en": "What is the chemical symbol for water?",
        "question_text_uz": "Suvning kimyoviy formulasi qaysi?",
        "options_en": ["HO", "H2O", "H2O2", "OH"],
        "options_uz": ["HO", "H2O", "H2O2", "OH"],
        "correct_answer_index": 1,
    },
    {
        "subject": "science",
        "question_text_en": "Which planet is closest to the Sun?",
        "question_text_uz": "Qaysi sayyora Quyoshga eng yaqin?",
        "options_en": ["Venus", "Earth", "Mercury", "Mars"],
        "options_uz": ["Venera", "Yer", "Merkuriy", "Mars"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "What gas do plants absorb during photosynthesis?",
        "question_text_uz": "O'simliklar fotosintez jarayonida qaysi gazni yutadi?",
        "options_en": ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        "options_uz": ["Kislorod", "Azot", "Karbonat angidrid", "Vodorod"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "What is the powerhouse of the cell?",
        "question_text_uz": "Hujayraning 'elektr stansiyasi' deb ataluvchi organoid qaysi?",
        "options_en": ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"],
        "options_uz": ["Yadro", "Ribosoma", "Mitoxondriya", "Vakuol"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "What is the boiling point of water at sea level?",
        "question_text_uz": "Dengiz sathida suvning qaynash harorati qancha?",
        "options_en": ["90°C", "95°C", "100°C", "105°C"],
        "options_uz": ["90°C", "95°C", "100°C", "105°C"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "How many bones are in the adult human body?",
        "question_text_uz": "Katta yoshli inson tanasida nechta suyak bor?",
        "options_en": ["196", "206", "216", "226"],
        "options_uz": ["196", "206", "216", "226"],
        "correct_answer_index": 1,
    },
    {
        "subject": "science",
        "question_text_en": "Which force pulls objects toward the center of the Earth?",
        "question_text_uz": "Jismlarni Yer markaziga tortadigan kuch qaysi?",
        "options_en": ["Magnetic force", "Friction", "Gravity", "Tension"],
        "options_uz": ["Magnit kuchi", "Ishqalanish", "Gravitatsiya", "Taranglik"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "What is the most abundant gas in Earth's atmosphere?",
        "question_text_uz": "Yer atmosferasida eng ko'p uchraydigan gaz qaysi?",
        "options_en": ["Oxygen", "Carbon dioxide", "Argon", "Nitrogen"],
        "options_uz": ["Kislorod", "Karbonat angidrid", "Argon", "Azot"],
        "correct_answer_index": 3,
    },
    {
        "subject": "science",
        "question_text_en": "Which organ pumps blood through the human body?",
        "question_text_uz": "Qon insonning tanasi bo'ylab qaysi organ tomonidan harakatlantiriladi?",
        "options_en": ["Lungs", "Liver", "Heart", "Kidney"],
        "options_uz": ["O'pka", "Jigar", "Yurak", "Buyrak"],
        "correct_answer_index": 2,
    },
    {
        "subject": "science",
        "question_text_en": "What type of rock is formed from cooled magma?",
        "question_text_uz": "Sovigan magndan qaysi turdagi tog' jinsi hosil bo'ladi?",
        "options_en": ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
        "options_uz": ["Cho'kindi", "Metamorfik", "Magmatik", "Ohaktosh"],
        "correct_answer_index": 2,
    },
 
    # ─────────────────────────────────────────
    # HISTORY  (subject = "history")
    # ─────────────────────────────────────────
    {
        "subject": "history",
        "question_text_en": "In which year did World War II end?",
        "question_text_uz": "Ikkinchi Jahon urushi qaysi yilda tugadi?",
        "options_en": ["1943", "1944", "1945", "1946"],
        "options_uz": ["1943", "1944", "1945", "1946"],
        "correct_answer_index": 2,
    },
    {
        "subject": "history",
        "question_text_en": "Who was the first President of the United States?",
        "question_text_uz": "AQShning birinchi Prezidenti kim bo'lgan?",
        "options_en": ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
        "options_uz": ["Tomas Jefferson", "Abrohom Linkoln", "Jorj Vashington", "Jon Adams"],
        "correct_answer_index": 2,
    },
    {
        "subject": "history",
        "question_text_en": "Which ancient wonder was located in Alexandria, Egypt?",
        "question_text_uz": "Misrning Iskandariya shahrida qaysi qadimiy mo'jiza joylashgan edi?",
        "options_en": [
            "The Colossus of Rhodes",
            "The Lighthouse of Alexandria",
            "The Hanging Gardens",
            "The Statue of Zeus",
        ],
        "options_uz": [
            "Rodos kolossi",
            "Iskandariya mayog'i",
            "Osma bog'lar",
            "Zevs haykali",
        ],
        "correct_answer_index": 1,
    },
    {
        "subject": "history",
        "question_text_en": "The Silk Road connected China to which region?",
        "question_text_uz": "Ipak yo'li Xitoyni qaysi hudud bilan bog'lagan?",
        "options_en": ["South America", "Sub-Saharan Africa", "The Mediterranean and Europe", "Australia"],
        "options_uz": ["Janubiy Amerika", "Sahroi Kabir janubi", "O'rta er dengizi va Yevropa", "Avstraliya"],
        "correct_answer_index": 2,
    },
    {
        "subject": "history",
        "question_text_en": "Amir Timur (Tamerlane) founded his empire with its capital in which city?",
        "question_text_uz": "Amir Temur o'z imperiyasini qaysi shaharni poytaxt qilib asos solgan?",
        "options_en": ["Bukhara", "Samarkand", "Tashkent", "Khiva"],
        "options_uz": ["Buxoro", "Samarqand", "Toshkent", "Xiva"],
        "correct_answer_index": 1,
    },
    {
        "subject": "history",
        "question_text_en": "In which year did the Soviet Union collapse?",
        "question_text_uz": "Sovet Ittifoqi qaysi yilda parchalandi?",
        "options_en": ["1989", "1990", "1991", "1992"],
        "options_uz": ["1989", "1990", "1991", "1992"],
        "correct_answer_index": 2,
    },
    {
        "subject": "history",
        "question_text_en": "Uzbekistan declared independence from the Soviet Union on which date?",
        "question_text_uz": "O'zbekiston Sovet Ittifoqidan qaysi sanada mustaqilligini e'lon qildi?",
        "options_en": ["August 31, 1991", "September 1, 1991", "October 1, 1991", "July 4, 1991"],
        "options_uz": ["1991-yil 31-avgust", "1991-yil 1-sentabr", "1991-yil 1-oktabr", "1991-yil 4-iyul"],
        "correct_answer_index": 0,
    },
    {
        "subject": "history",
        "question_text_en": "The French Revolution began in which year?",
        "question_text_uz": "Fransuz inqilobi qaysi yilda boshlangan?",
        "options_en": ["1776", "1789", "1799", "1804"],
        "options_uz": ["1776", "1789", "1799", "1804"],
        "correct_answer_index": 1,
    },
    {
        "subject": "history",
        "question_text_en": "Who wrote the theory of evolution by natural selection?",
        "question_text_uz": "Tabiiy tanlanish yo'li bilan evolyutsiya nazariyasini kim yozgan?",
        "options_en": ["Isaac Newton", "Albert Einstein", "Charles Darwin", "Gregor Mendel"],
        "options_uz": ["Isaak Nyuton", "Albert Eynshteyn", "Charlz Darvin", "Gregor Mendel"],
        "correct_answer_index": 2,
    },
    {
        "subject": "history",
        "question_text_en": "The ancient city of Babylon was located in modern-day which country?",
        "question_text_uz": "Qadimgi Bobil shahri hozirgi qaysi davlat hududida joylashgan edi?",
        "options_en": ["Iran", "Syria", "Iraq", "Turkey"],
        "options_uz": ["Eron", "Suriya", "Iroq", "Turkiya"],
        "correct_answer_index": 2,
    },
 
    # ─────────────────────────────────────────
    # GEOGRAPHY  (subject = "geography")
    # ─────────────────────────────────────────
    {
        "subject": "geography",
        "question_text_en": "What is the capital of Australia?",
        "question_text_uz": "Avstraliyaning poytaxti qaysi shahar?",
        "options_en": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        "options_uz": ["Sidney", "Melburn", "Kanberra", "Brisben"],
        "correct_answer_index": 2,
    },
    {
        "subject": "geography",
        "question_text_en": "Which is the longest river in the world?",
        "question_text_uz": "Dunyodagi eng uzun daryo qaysi?",
        "options_en": ["Amazon", "Yangtze", "Mississippi", "Nile"],
        "options_uz": ["Amazonka", "Yantszi", "Missisipi", "Nil"],
        "correct_answer_index": 3,
    },
    {
        "subject": "geography",
        "question_text_en": "On which continent is the Sahara Desert located?",
        "question_text_uz": "Saxroi Kabir cho'li qaysi qit'ada joylashgan?",
        "options_en": ["Asia", "South America", "Africa", "Australia"],
        "options_uz": ["Osiyo", "Janubiy Amerika", "Afrika", "Avstraliya"],
        "correct_answer_index": 2,
    },
    {
        "subject": "geography",
        "question_text_en": "What is the capital of Uzbekistan?",
        "question_text_uz": "O'zbekistonning poytaxti qaysi shahar?",
        "options_en": ["Samarkand", "Bukhara", "Namangan", "Tashkent"],
        "options_uz": ["Samarqand", "Buxoro", "Namangan", "Toshkent"],
        "correct_answer_index": 3,
    },
    {
        "subject": "geography",
        "question_text_en": "Which mountain is the highest in the world?",
        "question_text_uz": "Dunyodagi eng baland tog' qaysi?",
        "options_en": ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
        "options_uz": ["K2", "Kangchenjunga", "Everest tog'i", "Lxotse"],
        "correct_answer_index": 2,
    },
    {
        "subject": "geography",
        "question_text_en": "Which ocean is the largest in the world?",
        "question_text_uz": "Dunyodagi eng katta okean qaysi?",
        "options_en": ["Atlantic", "Indian", "Arctic", "Pacific"],
        "options_uz": ["Atlantika", "Hind", "Arktika", "Tinch"],
        "correct_answer_index": 3,
    },
    {
        "subject": "geography",
        "question_text_en": "How many countries share a border with Uzbekistan?",
        "question_text_uz": "O'zbekiston bilan chegaradosh davlatlar soni nechta?",
        "options_en": ["3", "4", "5", "6"],
        "options_uz": ["3", "4", "5", "6"],
        "correct_answer_index": 2,
    },
    {
        "subject": "geography",
        "question_text_en": "The Amazon River flows through which continent?",
        "question_text_uz": "Amazonka daryosi qaysi qit'a orqali oqadi?",
        "options_en": ["Africa", "Asia", "South America", "North America"],
        "options_uz": ["Afrika", "Osiyo", "Janubiy Amerika", "Shimoliy Amerika"],
        "correct_answer_index": 2,
    },
    {
        "subject": "geography",
        "question_text_en": "What is the smallest country in the world by area?",
        "question_text_uz": "Maydon bo'yicha dunyodagi eng kichik davlat qaysi?",
        "options_en": ["Monaco", "San Marino", "Liechtenstein", "Vatican City"],
        "options_uz": ["Monako", "San-Marino", "Lixtenshtayn", "Vatikan"],
        "correct_answer_index": 3,
    },
    {
        "subject": "geography",
        "question_text_en": "Which sea borders Uzbekistan to the west?",
        "question_text_uz": "O'zbekistonning g'arbiy chegarasida qaysi dengiz joylashgan?",
        "options_en": ["Caspian Sea", "Black Sea", "Aral Sea", "Red Sea"],
        "options_uz": ["Kaspiy dengizi", "Qora dengiz", "Orol dengizi", "Qizil dengiz"],
        "correct_answer_index": 2,
    },
 
    # ─────────────────────────────────────────
    # COMPUTER SCIENCE  (subject = "cs")
    # ─────────────────────────────────────────
    {
        "subject": "cs",
        "question_text_en": "What does CPU stand for?",
        "question_text_uz": "CPU nimani anglatadi?",
        "options_en": [
            "Central Processing Unit",
            "Central Program Utility",
            "Computer Processing Unit",
            "Core Processing Unit",
        ],
        "options_uz": [
            "Markaziy Ishlov Berish Qurilmasi",
            "Markaziy Dastur Yordamchisi",
            "Kompyuter Ishlov Berish Qurilmasi",
            "Yadro Ishlov Berish Qurilmasi",
        ],
        "correct_answer_index": 0,
    },
    {
        "subject": "cs",
        "question_text_en": "What is the time complexity of binary search?",
        "question_text_uz": "Ikkilik qidiruvning vaqt murakkabligi qancha?",
        "options_en": ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        "options_uz": ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        "correct_answer_index": 2,
    },
    {
        "subject": "cs",
        "question_text_en": "Which data structure uses LIFO (Last In, First Out) order?",
        "question_text_uz": "Qaysi ma'lumotlar strukturasi LIFO (oxirgi kirgan, birinchi chiqadi) tartibidan foydalanadi?",
        "options_en": ["Queue", "Stack", "Linked List", "Tree"],
        "options_uz": ["Navbat", "Stek", "Bog'liq ro'yxat", "Daraxt"],
        "correct_answer_index": 1,
    },
    {
        "subject": "cs",
        "question_text_en": "What does HTML stand for?",
        "question_text_uz": "HTML nimani anglatadi?",
        "options_en": [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Transfer Markup Language",
            "Hyper Text Modern Language",
        ],
        "options_uz": [
            "Gipermatn belgilash tili",
            "Yuqori matn mashina tili",
            "Hiper uzatish belgilash tili",
            "Hiper matn zamonaviy tili",
        ],
        "correct_answer_index": 0,
    },
    {
        "subject": "cs",
        "question_text_en": "Which of these is NOT a programming language?",
        "question_text_uz": "Quyidagilardan qaysi biri dasturlash tili EMAS?",
        "options_en": ["Python", "Java", "HTML", "C++"],
        "options_uz": ["Python", "Java", "HTML", "C++"],
        "correct_answer_index": 2,
    },
    {
        "subject": "cs",
        "question_text_en": "How many bits are in one byte?",
        "question_text_uz": "Bir baytda nechta bit bor?",
        "options_en": ["4", "8", "16", "32"],
        "options_uz": ["4", "8", "16", "32"],
        "correct_answer_index": 1,
    },
    {
        "subject": "cs",
        "question_text_en": "What does RAM stand for?",
        "question_text_uz": "RAM nimani anglatadi?",
        "options_en": [
            "Read Access Memory",
            "Random Access Memory",
            "Rapid Access Module",
            "Read And Modify",
        ],
        "options_uz": [
            "O'qish uchun xotira",
            "Tasodifiy kirish xotirasi",
            "Tezkor kirish moduli",
            "O'qish va o'zgartirish",
        ],
        "correct_answer_index": 1,
    },
    {
        "subject": "cs",
        "question_text_en": "Which sorting algorithm has the worst-case time complexity of O(n²)?",
        "question_text_uz": "Qaysi saralash algoritmi eng yomon holatda O(n²) vaqt murakkabligiga ega?",
        "options_en": ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
        "options_uz": ["Qo'shish saralash", "Tez saralash", "Ko'pikli saralash", "Uyum saralash"],
        "correct_answer_index": 2,
    },
    {
        "subject": "cs",
        "question_text_en": "In Python, which keyword is used to define a function?",
        "question_text_uz": "Pythonda funksiyani aniqlash uchun qaysi kalit so'z ishlatiladi?",
        "options_en": ["func", "define", "def", "function"],
        "options_uz": ["func", "define", "def", "function"],
        "correct_answer_index": 2,
    },
    {
        "subject": "cs",
        "question_text_en": "What is the result of 5 % 3 in most programming languages?",
        "question_text_uz": "Ko'pchilik dasturlash tillarida 5 % 3 ning natijasi qancha?",
        "options_en": ["0", "1", "2", "3"],
        "options_uz": ["0", "1", "2", "3"],
        "correct_answer_index": 2,
    },
]


def extract_questions() -> dict[str, dict[str, list[dict[str, object]]]]:
    quiz_js = (ROOT / "js" / "quiz.js").read_text(encoding="utf-8")
    if "const QUESTIONS = " not in quiz_js:
        quiz_js = subprocess.check_output(
            ["git", "show", "HEAD:js/quiz.js"],
            cwd=ROOT,
            text=True,
        )
    start = quiz_js.index("const QUESTIONS = ") + len("const QUESTIONS = ")
    end = quiz_js.index(";\n\nlet currentSubject")
    raw_object = quiz_js[start:end]
    json_like = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', raw_object)
    return json.loads(json_like)


def seed_questions(*, reset: bool = False) -> None:
    db = SessionLocal()
    try:
        if reset:
            db.query(Question).delete()
            db.commit()

        if db.query(Question).count() > 0:
            print("Questions already exist. Use --reset to replace them.")
            return

        for q in QUESTIONS:
            db.add(Question(**q))

        db.commit()
        print(f"Seeded {len(QUESTIONS)} questions successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed QuizArena questions from the existing frontend bank.")
    parser.add_argument("--reset", action="store_true", help="Delete existing questions before seeding.")
    args = parser.parse_args()
    seed_questions(reset=args.reset)
