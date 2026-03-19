import React from 'react';
import '../styles/Experience.css';

const Experience = () => {
    const experiences = [
        {
            company: "Xebia (AU Small Finance Bank)",
            website: "https://www.xebia.com",
            location: "Jaipur, RJ",
            duration: "Jan 2026 – Present",
            designation: "Java Developer",
            description: [
                "Led backend development of Spring Boot microservices for banking workflows, ensuring scalability, fault tolerance, and clear service boundaries.",
                "Delivered 5+ production features across transaction and reporting systems, improving workflow efficiency.",
                "Designed and built a virtual account system enabling merchants to collect payments, handling transaction mapping, validation, and high-volume processing.",
                "Resolved 10+ critical production issues through root-cause analysis, improving system reliability.",
                "Enforced validation, error handling, and modular architecture across services."
            ]
        },
        {
            company: "Infosys Limited",
            website: "https://www.infosys.com",
            location: "Jaipur, RJ",
            duration: "May 2022 – Present",
            designation: "Java Backend Developer",
            description: [
                "Optimized Spring Boot microservices, improving API latency by 40% through efficient service logic.",
                "Designed REST APIs for high-volume transaction and reporting systems, ensuring performance, validation, and data consistency.",
                "Resolved 25+ production incidents via debugging, log analysis, and permanent fixes.",
                "Strengthened transaction workflows by handling edge cases and improving data consistency.",
                "Partnered with QA and DevOps to support CI/CD pipelines, ensuring smooth releases and production stability."
            ]
        },
        {
            company: "Tech Mahindra",
            website: "https://www.techmahindra.com",
            location: "Mumbai, MH",
            duration: "Jan 2021 – Apr 2022",
            designation: "Associate Software Engineer",
            description: [
                "Supported backend systems for high-traffic BCCI/IPL platforms during peak loads.",
                "Improved API response time by 15% through request optimization and processing improvements.",
                "Reduced defects by 25% via improved validation and debugging practices.",
                "Identified performance bottlenecks and implemented fixes to enhance system responsiveness."
            ]
        },
        {
            company: "FoGraph",
            location: "Udaipur, RJ",
            duration: "Nov 2019 – Oct 2020",
            designation: "Android Developer (Co-founder)",
            description: [
                "Led product development and technical direction, driving feature delivery across releases.",
                "Built Android features improving UI flow, navigation, and overall user experience.",
                "Designed offline-first data layer using Firebase and SQLite for reliable synchronization.",
                "Reduced crashes by analyzing Crashlytics logs and fixing recurring stability issues."
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
