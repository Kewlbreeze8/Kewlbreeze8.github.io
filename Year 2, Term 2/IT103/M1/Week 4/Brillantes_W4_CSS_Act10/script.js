// Data for navigation links
const contentData = {
    home: {
      headline: "Welcome to Our Website",
      text: "This website is about upgrading and modifying your personal apps wherever and whenever you like. check out About and Services for more information."
    },
    about: {
      headline: "About Us",
      text: "This company is dedicated to provide top-notch services to our customers. Our goal is to deliver excellent results and ensure customer satisfaction based from their commentary and experience."
    },
    services: {
      headline: "Our Services",
      text: "We offer a variety of services to cater to your needs. Our main one is about app development and app modification. Others are web development, and digital marketing. Do check them out if you are interested to customize an app."
    },
    contact: {
      headline: "Contact Us",
      text: "If you are having any concerns and problems, Feel free to reach out to us via email or phone. We are here to answer any questions and provide any support you need."
    }
  };
  
  // Function to update content
  function updateContent(contentKey) {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h1>${contentData[contentKey].headline}</h1>
      <p>${contentData[contentKey].text}</p>
    `;
  }
  
  // Event listeners for navigation links
  document.querySelectorAll(".left-column nav ul li a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const contentKey = e.target.dataset.content;
      updateContent(contentKey);
    });
  });
  