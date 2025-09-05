import { useState } from 'react';
import { HabitchecklistCard } from './../shared/components/HabitChecklistCard';

export const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleHomeButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={handleHomeButtonClick}>
        home
      </button>
      {showPopup && (
        <HabitchecklistCard onClose={handleClosePopup} />
      )}
    </div>
  );
};
