function getRandomZenImage() {
  const images = [
    'image-1.png',
    'image-2.png',
    'image-3.png',
    'image-4.png',
    'image-5.png'
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  console.log(`Selected image: ${images[randomIndex]}`);
  return images[randomIndex];
}

function hideFeedAndShowZenImage() {
  console.log('Attempting to hide feed and show zen image');
  const mainFeed = document.querySelector('main.scaffold-layout__main[aria-label="Main Feed"]');
  const asideFeed = document.querySelector('aside.scaffold-layout__aside[aria-label="LinkedIn News"]');

  if (mainFeed) {
    console.log('Main feed found, hiding it');
    mainFeed.style.display = 'none';
    
    if (!document.querySelector('.zen-image')) {
      console.log('Zen image not found, creating it');
      const zenImage = document.createElement('img');
      const imagePath = getRandomZenImage();
      zenImage.src = chrome.runtime.getURL(imagePath);
      zenImage.className = 'zen-image';
      zenImage.onerror = (e) => {
        console.error(`Failed to load image: ${imagePath}`, e);
        zenImage.alt = 'Failed to load Zen image';
      };
      zenImage.onload = () => {
        console.log(`Successfully loaded image: ${imagePath}`);
      };
      mainFeed.parentNode.insertBefore(zenImage, mainFeed);
    } else {
      console.log('Zen image already exists');
    }
  } else {
    console.log('Main feed not found');
  }

  if (asideFeed) {
    console.log('Aside feed found, hiding it');
    asideFeed.style.display = 'none';
  } else {
    console.log('Aside feed not found');
  }
}

console.log('Content script loaded');

// Run the function when the page loads
hideFeedAndShowZenImage();

// Use a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(mutations => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      console.log('DOM changed, re-running hideFeedAndShowZenImage');
      hideFeedAndShowZenImage();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
console.log('MutationObserver set up');

document.documentElement.style.setProperty('--content-visibility', 'hidden', 'important');
