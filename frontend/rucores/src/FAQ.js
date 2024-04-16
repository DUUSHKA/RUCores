import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What are RUcoins?",
    answer:
      "RUcoins are a virtual currency that can be used to book Rutgers's state-of-the-art facilities",
  },
  {
    question: "Why RUcoins?",
    answer:
      "Virtual currency is beneficial for faster transactions, improved privacy and lower transaction fees. Digital currencies also help with data analytics so you could look at your spending habits and patterns. ",
  },
  {
    question: "Where can I use RUcoins?",
    answer: "They can be used on our website RUcoins wallet",
  },
  {
    question: "How do I earn RUcoins?",
    answer:
      "They can be earned through various Rutgers activities, such as hackathons, attending seminars, participating in research projects, or other campus events designated by Rutgers",
  },
  {
    question: "How do I schedule a booking?",
    answer:
      "On our website, we have a designated tab for each facility where you can browse a calendar of the facility's availabilities and select a date and time frame that works best for you",
  },
  {
    question: "Will all bookings cost the same amount?",
    answer:
      "Depending on the facility and the equipment available at each facility they could cost different amounts, there is no standard amount for how much a facility booking could cost",
  },
  {
    question:
      "How does the refund process work when I cancel a booking in advance?",
    answer:
      "The RUcoins are instantly transferred back into your wallet as soon as you cancel the booking",
  },
  {
    question: "What are bookings?",
    answer:
      "Bookings are time blocks allotted for Rutgers facilities where people can spend RUcoins to book a time block to use the facility",
  },
  {
    question: "Why would I want to book a facility?",
    answer:
      "Rutgers University hosts centers of state-of-the-art equipment for faculty research projects that you may want to use for a project of your own?",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Users register time slots to use the equipment for research and pay by the hour",
  },
  {
    question: "Is the RU Cores Wallet secure?",
    answer:
      "Yes, security is a top priority for RU Cores Wallet. The system is built with robust security protocols, including secure transaction logs, regular audits, and encryption of sensitive information to protect user data and prevent unauthorized access.",
  },
  {
    question: "Can I use RU Cores Wallet for other payments at Rutgers?",
    answer: "No, RU coins can only be spent to book facilities",
  },
  {
    question: "What If I run into a problem with the software?",
    answer: "Contacts Rutgers administration ",
  },
  {
    question: "How can I check my RU Coins balance and transaction history?",
    answer:
      "Users can view their current RU Coins balance and a detailed log of all transactions within the wallet section of the RU Cores Wallet application. This section provides insights into spending habits and coin earnings.",
  },
  {
    question: "Are there transaction fees associated with RU Coins?",
    answer:
      "No, there are no transaction fees for using RU Coins within the RU Cores Wallet system. This facilitates smoother and more cost-effective transactions for all users.",
  },
  {
    question: "How do I get started with RU Cores Wallet?",
    answer:
      "To begin using the RU Cores Wallet, you'll need to register with your Rutgers University credentials. Once registered, you can log into the system, where you'll receive instructions on how to earn and manage your RU Coins",
  },
  {
    question: "What happens to my RU Coins when I graduate or leave Rutgers?",
    answer:
      "The policy regarding RU Coins after leaving Rutgers is still under development. However, it's likely that users will be encouraged to spend all their RU Coins before departing from the university, or transfer them under specific conditions.",
  },
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
