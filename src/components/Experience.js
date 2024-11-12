import React from 'react';
import '../styles/Experience.css';

const Experience = () => {
    const experiences = [
        {
            company: "Infosys",
            website: "https://www.infosys.com",
            location: "Jaipur, Rajasthan, India",
            duration: "May 2022 - Present",
            designation: "Systems Engineer",
            description: [
                "Improved system performance by 40% with Java and Spring Boot.",
                "Reduced project delivery time by 25% by partnering with stakeholders.",
                "Resolved critical production issues, reducing downtime by 20%."
            ]
        },
        {
            company: "Tech Mahindra",
            website: "https://www.techmahindra.com",
            location: "Mumbai, Maharashtra, India",
            duration: "Jan 2021 - Apr 2022",
            designation: "Associate Software Engineer",
            description: [
                "Enhanced user engagement for BCCI and IPL mobile apps by 30%.",
                "Conducted unit testing and debugging within the Android framework.",
                "Participated in code reviews to optimize the Android codebase."
            ]
        },
        {
            company: "FoGraph",
            location: "Udaipur, Rajasthan, India",
            duration: "Aug 2019 - Nov 2020",
            designation: "Android Developer and Marketing",
            description: [
                "Integrated custom features and resolved critical bugs in Android source code.",
                "Suggested optimizations leading to a 25% improvement in app performance.",
                "Led marketing campaigns to increase app downloads."
            ]
        }
    ];

    return (
        <section className="experience">
            <h2>Work Experience</h2>
            {experiences.map((exp, index) => (
                <div className="experience-block" key={index}>
                    <h3>
                        <a href={exp.website} target="_blank" rel="noopener noreferrer">
                            {exp.company}
                        </a>
                    </h3>
                    <p className="location">{exp.location}</p>
                    <p className="duration">{exp.duration}</p>
                    <p className="designation">{exp.designation}</p>
                    <ul>
                        {exp.description.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
};

export default Experience;
