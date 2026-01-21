import React from 'react';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/layout';

export const Template = () => {
  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle }}>
      <div style={{ ...columnContainerStyle }}>
        Template Page
      </div>
    </div>
  );
}