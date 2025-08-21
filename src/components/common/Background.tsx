import { useTheme } from '../../stores/theme';
import lightBackground from '../utils/BG-Pokemon-Light.png';
import darkBackground from '../utils/BG-Pokemon-Dark.png';

const Background = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10">
      <img
        src={theme === 'dark' ? darkBackground : lightBackground}
        alt="Background"
        className="w-full h-full object-cover"
      />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-white/80'}`} />
    </div>
  );
};

export default Background;