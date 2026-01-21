import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/layout';
import ColourThemeToggle from '../component/button/ColourThemeToggle';
// import LocalToggle from '../components/buttons/LocalToggle';

export const Settings = () => {
  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle }}>
      <div style={{ ...columnContainerStyle }}>
        SETTINGS
        {/* <LocalToggle field="settingDarkMode"/> */}
        <ColourThemeToggle/>
      </div>
    </div>
  );
}