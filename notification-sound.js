// Notification sound generator - creates a simple beep sound
function createNotificationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Double beep pattern
  oscillator.frequency.value = 800; // Hz
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  
  oscillator.start(audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  oscillator.stop(audioContext.currentTime + 0.1);
  
  // Second beep
  setTimeout(() => {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    osc2.frequency.value = 1000; // Hz
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    osc2.start(audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    osc2.stop(audioContext.currentTime + 0.15);
  }, 150);
}

// Trigger sound on user interaction first (browser requirement)
document.addEventListener('click', () => {
  if (typeof createNotificationSound === 'function') {
    // Just unlock audio context on first interaction
  }
}, { once: true });
