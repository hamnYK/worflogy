/* CSS is the source of truth; loaded before the vector renderers. */
(()=>{'use strict';const css=getComputedStyle(document.documentElement),theme={};
for(const role of ["background","plane","plane-secondary","plane-result","grid","border","link","active","flow","ink","dark","accent","highlight","pale","secondary","secondary-dark","secondary-light","gold","cream","paper","edge","white","shadow","skin","tile-side","tile-front","tile-selected","tile"]){const value=css.getPropertyValue('--scene-'+role).trim();if(!/^#[0-9a-f]{6}$/i.test(value))throw new Error('Invalid canvas theme token: '+role);theme[role.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=parseInt(value.slice(1),16);}
window.WorfTheme=Object.freeze(theme);
const routeSpacing={};
for(const role of ['diagnosis-inset','context-gap','context-outset','learning-gap','infrastructure-gap']){
 const value=css.getPropertyValue('--diagram-route-'+role).trim();
 if(!/^\d+(?:\.\d+)?$/.test(value))throw new Error('Invalid diagram route token: '+role);
 routeSpacing[role.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=Number(value);
}
window.WorfRouteSpacing=Object.freeze(routeSpacing);
const motionDuration=role=>{const value=css.getPropertyValue('--motion-overview-'+role+'-duration').trim();if(!/^\d+(?:\.\d+)?ms$/.test(value))throw new Error('Invalid overview motion token: '+role);return parseFloat(value);};
const storyDuration=role=>{const value=css.getPropertyValue('--motion-story-'+role+'-duration').trim();if(!/^\d+(?:\.\d+)?ms$/.test(value))throw new Error('Invalid story motion token: '+role);return parseFloat(value);};
window.WorfMotion=Object.freeze({workflow:Object.freeze({flowDuration:storyDuration('flow'),packetStagger:storyDuration('stagger'),responseDuration:storyDuration('response'),ease:css.getPropertyValue('--motion-story-ease').trim()}),overview:Object.freeze({flowDuration:motionDuration('flow'),feedbackDuration:motionDuration('feedback'),ease:css.getPropertyValue('--motion-overview-ease').trim()})});})();
