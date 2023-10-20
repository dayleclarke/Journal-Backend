import { CategoryModel, EntryModel, dbClose } from './db.js'

// Delete the existing entries in our database. 
await EntryModel.deleteMany() 
console.log('Deleted all entries in the Journal database')

await CategoryModel.deleteMany()
console.log('Deleted all categories in the Journal database')

// A list of objects containing the data for each category. 
const categories = [
    { name: 'Career', description: "Career affirmations are empowering declarations that people repeat to bolster their career-related beliefs, attitudes, and behaviours. These positive statements are carefully crafted to rewire thought patterns and nurture a constructive mindset. By regularly practicing career affirmations, individuals can elevate their self-confidence, invigorate motivation, and enhance productivity in their professional journey. Moreover, these affirmations promote openness, compassion, and assertiveness in interpersonal interactions with colleagues and superiors. They can also contribute to a heightened sense of job satisfaction and an improved work-life balance." },
    { name: 'Health', description: "Health affirmations are powerful and positive statements that individuals use to nurture their well-being and vitality. These affirmations are crafted to reinforce constructive beliefs, attitudes, and habits related to physical and mental health. By incorporating health affirmations into their daily routines, people can boost their self-esteem, foster a strong commitment to healthy choices, and improve their overall quality of life. In addition, health affirmations encourage self-compassion and a proactive approach to well-being, which can lead to greater resilience and a sense of inner peace. Consistently practicing these affirmations contributes to a healthier and more fulfilling life, both physically and mentally." },
    { name: 'Anxiety', description: "Anxiety affirmations are powerful tools for managing and overcoming feelings of anxiety and stress. These positive statements are designed to reframe thought patterns, instill a sense of calm, and promote emotional well-being. By regularly practicing anxiety-affirmations, individuals can regain control over their thoughts and emotions, fostering a more relaxed and centered mindset. These affirmations encourage self-compassion and self-acceptance, making it easier to cope with anxiety-inducing situations. They also instill a deep sense of resilience, helping individuals confront their fears and uncertainties with a greater sense of inner peace. Over time, consistent use of anxiety affirmations can lead to a reduction in anxiety symptoms and a more balanced and tranquil state of mind." },
    { name: 'Relationships', description: "Relationship affirmations are powerful tools for nurturing and enhancing connections with others. These positive statements are designed to promote healthy beliefs, attitudes, and behaviors within relationships. By consistently practicing relationship affirmations, individuals can strengthen their self-esteem, empathy, and communication skills, which, in turn, fosters more positive and harmonious interactions with friends, family, and romantic partners. These affirmations encourage self-compassion and encourage a mindset of understanding and patience, even during challenging moments in relationships. They also promote a deep sense of trust, allowing individuals to build stronger, more fulfilling bonds with others. Through regular use of relationship affirmations, people can create more meaningful and loving connections, resulting in healthier and happier relationships." },
] 

// Once the categories are created we need to provide the ID of the category instead of a hard-coded string when listing an entry. 
const cats = await CategoryModel.insertMany(categories) // Cats is short for category. 
console.log('Inserted Categories')

//Again we store the data for each entry in an array of objects. Now instead of a hard-coded string for the category we use square brackets to specify which object in the cats array to use. cats[0] refers to the first category in the cats array. 
const entries = [
    { category: cats[0], content: "I am confident in my knowledge, skills and abilities, and I bring value to my workplace."},
    { category: cats[0], content: "I am open to new opportunities and welcome positive changes in my career."},
    { category: cats[0], content: "I trust in my capacity to learn, grow, and adapt in my career."},
    { category: cats[0], content: "I am a problem solver and can overcome any challenges that come my way."},
    { category: cats[0], content: "I deserve success and abundance in my career."},
    { category: cats[0], content: "I am focused and determined to achieve my career goals."},
    { category: cats[0], content: "I am a valuable asset to my team and organisation."},
    { category: cats[0], content: "I am continuously improving my skills and expanding my knowledge."},
    { category: cats[0], content: "I am a leader, and I inspire and motivate others in my workplace."},
    { category: cats[0], content: "I attract success and prosperity in my career."},
    { category: cats[0], content: "I am in control of my career path, and I make choices that align with my values."},
    { category: cats[0], content: "I am open to networking and building valuable professional connections."},
    { category: cats[0], content: "I am grateful for my career, and I find joy and fulfillment in my work."},
    { category: cats[0], content: "I believe in my potential to achieve greatness in my career."},
    { category: cats[0], content: "I am confident in my ability to balance work and personal life."},

    { category: cats[1], content: "I am in great health, and my body is a source of energy and vitality."},
    { category: cats[1], content: "I make choices that nourish my body and mind, promoting overall well-being."},
    { category: cats[1], content: "I am free from stress and anxiety, and I welcome peace into my life."},
    { category: cats[1], content: "Every day, I am getting stronger and healthier in every way."},
    { category: cats[1], content: "I love and care for my body, and it responds with good health and vitality."},
    { category: cats[1], content: "I am grateful for the gift of good health and the opportunity to live a fulfilling life."},
    { category: cats[1], content: "I am in control of my health, and I make positive choices for my well-being."},
    { category: cats[1], content: "My immune system is strong and protects me from illness and disease."},
    { category: cats[1], content: "I release all negative energy and embrace the healing power of positivity."},
    { category: cats[1], content: "I listen to my body and give it the rest and care it needs to thrive."},
    { category: cats[1], content: "I radiate positive energy and attract good health and wellness into my life."},
    { category: cats[1], content: "I am at peace with my body and accept it as it is, nurturing it with love and kindness."},
    { category: cats[1], content: "I choose health, happiness, and well-being in every aspect of my life."},
    { category: cats[1], content: "I trust my body's natural ability to heal and restore itself."},
    { category: cats[1], content: "I am grateful for each day of good health and the opportunity to enjoy life to the fullest."},
    
    { category: cats[2], content: "I am in control of my thoughts, and I choose to focus on the present moment."},
    { category: cats[2], content: "I am safe, and I trust that I can handle any situation that comes my way."},
    { category: cats[2], content: "I release the need to worry and embrace peace and tranquility."},
    { category: cats[2], content: "I breathe deeply and calmly, allowing relaxation to flow through me."},
    { category: cats[2], content: "I am resilient, and I have the strength to overcome anxiety."},
    { category: cats[2], content: "I replace anxious thoughts with positive and empowering ones."},
    { category: cats[2], content: "I am not defined by my anxiety; I am defined by my strength and courage."},
    { category: cats[2], content: "I am open to seeking help and support when needed, and it's a sign of self-care."},
    { category: cats[2], content: "I practice self-compassion and show myself the kindness I deserve."},
    { category: cats[2], content: "I release the need for perfection and embrace my imperfections with love."},
    { category: cats[2], content: "I am grounded, and I trust in my ability to handle life's challenges."},
    { category: cats[2], content: "I let go of the past and look forward to a future filled with peace and contentment."},
    { category: cats[2], content: "I am worthy of happiness, and I choose to focus on positive aspects of life."},
    { category: cats[2], content: "I embrace uncertainty as an opportunity for growth and self-discovery."},
    { category: cats[2], content: "I am resilient, and I have the power to transform anxiety into strength and wisdom."},

    { category: cats[3], content: "I am deserving of loving and healthy relationships."},
    { category: cats[3], content: "I communicate openly and honestly, fostering understanding and trust."},
    { category: cats[3], content: "I am a source of support and encouragement to my loved ones."},
    { category: cats[3], content: "I am grateful for the connections I have and the love I give and receive."},
    { category: cats[3], content: "I attract positive and loving people into my life."},
    { category: cats[3], content: "I choose to forgive and let go of past grievances, allowing room for growth."},
    { category: cats[3], content: "I am patient and understanding, especially during challenging times."},
    { category: cats[3], content: "I am a good listener, and I value the perspectives and feelings of others."},
    { category: cats[3], content: "I create a safe and nurturing space for open communication."},
    { category: cats[3], content: "I am confident in my ability to resolve conflicts peacefully."},
    { category: cats[3], content: "I am open to giving and receiving love, and I embrace vulnerability."},
    { category: cats[3], content: "I choose to focus on the positive qualities of my loved ones."},
    { category: cats[3], content: "I am worthy of love and respect in all my relationships."},
    { category: cats[3], content: "I maintain healthy boundaries that protect my well-being and the well-being of others."},
    { category: cats[3], content: "I am committed to building and nurturing strong, fulfilling relationships."},
]

await EntryModel.insertMany(entries)
console.log('Inserted Entries')

dbClose() // This is used to close the open MongoDB connection explicitly. If you have an open moongose database connection it wont allow the app to terminate once it has been used to seed the database.
