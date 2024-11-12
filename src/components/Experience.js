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
                "Improved system performance by 40% by optimizing Java applications with Spring Boot and REST APIs, enhancing overall user experience and productivity.",
                "Reduced project delivery time by 25% by partnering with stakeholders to translate high-level business needs into detailed technical specifications, resulting in cost savings and improved project timelines.",
                "Resolved critical production issues, reducing downtime by 20%, and ensuring uninterrupted application availability, resulting in improved overall system reliability and customer satisfaction"
            ]
        },
        {
            company: "Tech Mahindra",
            website: "https://www.techmahindra.com",
            location: "Mumbai, Maharashtra, India",
            duration: "Jan 2021 - Apr 2022",
            designation: "Associate Software Engineer",
            description: [
                "Enhanced user engagement of BCCI and IPL mobile applications by 30%, while reducing post-release bugs by 25%, leading to increased customer satisfaction and retention.",
                "Conducted unit testing and assisted in debugging complex application issues within the Android framework, showcasing strong analytical and problem-solving skills.",
                "Participated in code reviews, providing valuable feedback for code optimization and improvement within the Android codebase, highlighting a commitment to quality and continuous improvement."
            ]
        },
        {
            company: "FoGraph",
            location: "Udaipur, Rajasthan, India",
            duration: "Aug 2019 - Nov 2020",
            designation: "Android Developer and Marketing",
            description: [
                "Improved Android app functionality by integrating custom features and resolving critical bugs in the Android source code.",
                "Resolved critical application bugs by analysing code, debugging, and implementing patches, ensuring smooth operation and optimal performance.",
                "Suggested 10+ potential optimizations for the codebase, leading to a '25%' improvement in app performance and user experience."
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
