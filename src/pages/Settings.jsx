import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/container';
import LocalToggle from '../components/buttons/LocalToggle';

export const Settings = () => {
  console.log("Rendering Settings");
  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle }}>
      <div style={{ ...columnContainerStyle }}>
        SETTINGS
        <LocalToggle field="settingDarkMode"/>
      </div>
    </div>
  );
}