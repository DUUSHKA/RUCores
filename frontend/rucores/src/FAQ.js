import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "How do I sign up for RU Cores Wallet?",
    answer:
      "Currently, sign-up is automatically handled for Rutgers personnel. If you're eligible, you'll receive login credentials via your Rutgers email.",
  },
  {
    question: "How can I add RU Coins to my wallet?",
    answer:
      "RU Coins can be added through approved Rutgers activities or by converting funds from your Rutgers financial account.",
  },
  {
    question: "What can I use RU Coins for?",
    answer:
      "RU Coins can be used to book and access various Rutgers core facilities, with transactions managed directly through the RU Cores Wallet platform.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faqContainer">
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faqItem ${activeIndex === index ? "active" : ""}`}
          onClick={() => toggleFAQ(index)}
        >
          <h2>{faq.question}</h2>
          {activeIndex === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default FAQ;
