const bcrypt = require('bcryptjs');
const db = require('./db');

// Sample users
const users = [
    { username: 'imam_abdullah', password: 'password123', role: 'Imam' },
    { username: 'parent_fatima', password: 'password123', role: 'Parent' },
    { username: 'parent_ahmed', password: 'password123', role: 'Parent' }
];

// Sample questions with tags
const questions = [
    {
        title: 'What are the times for Jummah prayer?',
        content: 'Assalamu alaikum, I would like to know the timings for Jummah prayer at our masjid. Are there multiple sessions?',
        username: 'parent_fatima',
        tags: 'Prayer,Jummah,Schedule'
    },
    {
        title: 'Islamic classes for children',
        content: 'Are there any weekend Islamic classes available for children aged 7-10? What topics are covered?',
        username: 'parent_ahmed',
        tags: 'Education,Children,Classes'
    },
    {
        title: 'Ramadan iftar arrangements',
        content: 'Will the masjid be organizing community iftar during Ramadan? How can we contribute or volunteer?',
        username: 'parent_fatima',
        tags: 'Ramadan,Community,Events'
    },
    {
        title: 'Learning to recite Quran properly',
        content: 'I want to improve my Quran recitation and learn tajweed. Does the masjid offer classes for adults?',
        username: 'parent_ahmed',
        tags: 'Quran,Education,Tajweed'
    },
    {
        title: 'Parking facilities',
        content: 'Is there parking available near the masjid for Friday prayers? It gets quite crowded.',
        username: 'parent_fatima',
        tags: 'Facilities,Parking,Jummah'
    }
];

// Sample answers
const answers = [
    {
        questionTitle: 'What are the times for Jummah prayer?',
        content: 'Wa alaikum assalam. We have two Jummah sessions: First session at 12:30 PM and second session at 1:45 PM. Both include the khutbah followed by prayer.',
        username: 'imam_abdullah',
        isAccepted: true
    },
    {
        questionTitle: 'Islamic classes for children',
        content: 'Yes, we have weekend classes every Saturday from 10 AM to 12 PM. We cover Quran recitation, basic Islamic studies, and Arabic language. Registration is open now.',
        username: 'imam_abdullah',
        isAccepted: true
    },
    {
        questionTitle: 'Islamic classes for children',
        content: 'My children attend these classes and they really enjoy them! The teachers are very patient and knowledgeable.',
        username: 'parent_fatima',
        isAccepted: false
    },
    {
        questionTitle: 'Ramadan iftar arrangements',
        content: 'Alhamdulillah, we will be organizing daily community iftars. You can sign up to sponsor a day or volunteer to help with preparation. Details will be announced soon.',
        username: 'imam_abdullah',
        isAccepted: true
    },
    {
        questionTitle: 'Learning to recite Quran properly',
        content: 'We offer tajweed classes for adults on Tuesday and Thursday evenings at 7 PM. Classes are taught by qualified instructors. Please contact the masjid office to enroll.',
        username: 'imam_abdullah',
        isAccepted: true
    },
    {
        questionTitle: 'Parking facilities',
        content: 'There is a parking lot behind the masjid with space for about 50 cars. For Friday prayers, we also have an arrangement with the nearby community center for additional parking.',
        username: 'imam_abdullah',
        isAccepted: true
    }
];

async function seedDatabase() {
    console.log('Starting database seeding...');

    // Wait for database to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear existing data
    db.serialize(async () => {
        db.run('DELETE FROM answers');
        db.run('DELETE FROM questions');
        db.run('DELETE FROM users');

        // Insert users
        console.log('Inserting users...');
        const userIds = {};

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                    [user.username, hashedPassword, user.role],
                    function (err) {
                        if (err) reject(err);
                        userIds[user.username] = this.lastID;
                        console.log(`  Created user: ${user.username} (${user.role})`);
                        resolve();
                    }
                );
            });
        }

        // Insert questions with tags
        console.log('Inserting questions...');
        const questionIds = {};

        for (const question of questions) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO questions (user_id, title, content, tags) VALUES (?, ?, ?, ?)',
                    [userIds[question.username], question.title, question.content, question.tags || ''],
                    function (err) {
                        if (err) reject(err);
                        questionIds[question.title] = this.lastID;
                        console.log(`  Created question: ${question.title}`);
                        resolve();
                    }
                );
            });
        }

        // Insert answers
        console.log('Inserting answers...');

        for (const answer of answers) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO answers (question_id, user_id, content, is_accepted) VALUES (?, ?, ?, ?)',
                    [
                        questionIds[answer.questionTitle],
                        userIds[answer.username],
                        answer.content,
                        answer.isAccepted ? 1 : 0
                    ],
                    function (err) {
                        if (err) reject(err);
                        console.log(`  Created answer for: ${answer.questionTitle}`);
                        resolve();
                    }
                );
            });
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\nSample credentials:');
        console.log('  Imam: imam_abdullah / password123');
        console.log('  Parent: parent_fatima / password123');
        console.log('  Parent: parent_ahmed / password123');

        process.exit(0);
    });
}

// Run seeding
seedDatabase().catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
