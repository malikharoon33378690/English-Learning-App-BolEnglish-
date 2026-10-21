import { GrammarRule } from '../types';

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'rule-svo',
    titleEnglish: 'Sentence Structure: English (SVO) vs Urdu (SOV)',
    titleUrdu: 'جملے کی ساخت: اردو اور انگریزی میں بنیادی فرق',
    explanationEnglish: 'In Urdu, the verb comes at the very end of the sentence (Subject + Object + Verb). In English, the action verb sits right in the middle (Subject + Verb + Object)!',
    explanationUrdu: 'اردو زبان میں کام (Verb) ہمیشہ جملے کے آخر میں آتا ہے، جبکہ انگریزی میں کام فاعل (کرنے والے) کے فوراً بعد یعنی درمیان میں آتا ہے۔',
    keyDifference: 'Urdu: فاعل + مفعول + فعل | English: Subject + Verb + Object',
    urduPattern: 'میں (Subject) + سیب (Object) + کھاتا ہوں (Verb)',
    englishPattern: 'I (Subject) + eat (Verb) + an apple (Object)',
    examples: [
      {
        english: 'I drink water.',
        urdu: 'میں پانی پیتا ہوں۔',
        romanUrdu: 'Main paani peeta hoon.',
        note: 'نوٹ کریں: انگریزی میں "drink" پہلے آیا اور "water" بعد میں۔'
      },
      {
        english: 'She reads a book.',
        urdu: 'وہ کتاب پڑھتی ہے۔',
        romanUrdu: 'Woh kitaab parhti hai.',
        note: 'English puts "reads" before "a book".'
      },
      {
        english: 'They play cricket.',
        urdu: 'وہ کرکٹ کھیلتے ہیں۔',
        romanUrdu: 'Woh cricket kheltay hain.',
        note: 'Subject (They) + Action (play) + What (cricket).'
      }
    ]
  },
  {
    id: 'rule-is-am-are',
    titleEnglish: 'Using "Is", "Am", and "Are" Correctly',
    titleUrdu: 'Is, Am اور Are کا درست استعمال (ہے، ہوں، ہیں)',
    explanationEnglish: 'Use "Am" only with "I" (ہوں). Use "Is" with single subjects like He, She, It, or a single name (ہے). Use "Are" with plural subjects or "You" and "We" (ہیں یا ہو).',
    explanationUrdu: 'انگریزی میں حالت بتانے کے لیے Is, Am, Are استعمال ہوتے ہیں۔ "Am" صرف "I" (میں) کے لیے، "Is" ایک فرد یا چیز کے لیے، اور "Are" جمع یا "You/We" کے لیے آتا ہے۔',
    keyDifference: 'I -> Am | He/She/It/Single -> Is | You/We/They/Plural -> Are',
    urduPattern: 'میں ٹھیک ہوں (Am) | وہ استاد ہے (Is) | ہم خوش ہیں (Are)',
    englishPattern: 'I am fine | He is a teacher | We are happy',
    examples: [
      {
        english: 'I am a student.',
        urdu: 'میں ایک طالب علم ہوں۔',
        romanUrdu: 'Main aik taalib-e-ilm hoon.'
      },
      {
        english: 'He is my best friend.',
        urdu: 'وہ میرا بہترین دوست ہے۔',
        romanUrdu: 'Woh mera behtareen dost hai.'
      },
      {
        english: 'They are ready.',
        urdu: 'وہ سب تیار ہیں۔',
        romanUrdu: 'Woh sab tayyar hain.'
      }
    ]
  },
  {
    id: 'rule-has-have',
    titleEnglish: 'Possession: "Have" vs "Has" (پاس ہے)',
    titleUrdu: 'ملکیت بتانا: Has اور Have کا استعمال (پاس ہے)',
    explanationEnglish: 'When saying "I have / you have / we have / they have", use "Have". For singular third person (He has / She has / It has), use "Has".',
    explanationUrdu: 'جب بتانا ہو کہ کسی کے پاس کوئی چیز ہے تو انگریزی میں Has یا Have لگاتے ہیں۔ I, You, We, They کے ساتھ "Have" اور He, She, It کے ساتھ "Has"۔',
    keyDifference: 'I / You / We / They -> Have | He / She / It -> Has',
    urduPattern: 'میرے پاس گاڑی ہے | اس کے پاس قلم ہے',
    englishPattern: 'I have a car | He has a pen',
    examples: [
      {
        english: 'I have a new English book.',
        urdu: 'میرے پاس انگریزی کی ایک نئی کتاب ہے۔',
        romanUrdu: 'Meray paas Angrezi ki aik nayi kitaab hai.'
      },
      {
        english: 'She has two brothers.',
        urdu: 'اس کے دو بھائی ہیں۔',
        romanUrdu: 'Uss ke do bhai hain.'
      },
      {
        english: 'We have enough time.',
        urdu: 'ہمارے پاس کافی وقت ہے۔',
        romanUrdu: 'Hamaray paas kaafi waqt hai.'
      }
    ]
  },
  {
    id: 'rule-questions-do-does',
    titleEnglish: 'Asking Questions with "Do" and "Does"',
    titleUrdu: 'انگریزی میں سوال پوچھنا: Do اور Does کا طریقہ',
    explanationEnglish: 'In English, everyday present questions start with Do or Does before the subject! Use "Do" for I/You/We/They and "Does" for He/She/It.',
    explanationUrdu: 'اردو میں صرف "کیا" لگا کر سوال بن جاتا ہے (کیا آپ چائے پیتے ہیں؟)۔ انگریزی میں جملے کے شروع میں "Do" یا "Does" لانا لازمی ہوتا ہے۔',
    keyDifference: 'Do + (You/They/We/I) + Verb? | Does + (He/She/It) + Verb?',
    urduPattern: 'کیا آپ انگریزی بولتے ہیں؟',
    englishPattern: 'Do you speak English?',
    examples: [
      {
        english: 'Do you speak English?',
        urdu: 'کیا آپ انگریزی بولتے ہیں؟',
        romanUrdu: 'Kya aap Angrezi boltay hain?'
      },
      {
        english: 'Does he live in Lahore?',
        urdu: 'کیا وہ لاہور میں رہتا ہے؟',
        romanUrdu: 'Kya woh Lahore mein rehta hai?'
      },
      {
        english: 'Do they like mangoes?',
        urdu: 'کیا انہیں آم پسند ہیں؟',
        romanUrdu: 'Kya unhain aam pasand hain?'
      }
    ]
  }
];
