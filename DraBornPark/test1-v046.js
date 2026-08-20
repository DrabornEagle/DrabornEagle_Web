/* DraBornPark Test1 v0.4.6 icon refinement. Loaded after app.js. */
(function(){
  if(typeof ICONS==='undefined') return;
  Object.assign(ICONS,{
    blocking_exit:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-soft" d="M5.5 17.5 8.8 10h14.4l3.3 7.5v6.2H24v2.3h-3v-2.3H11V26H8v-2.3H5.5z"/><path class="dbp-stroke" d="M9 17.5h14M11 10l1.7-3h6.6l1.7 3M9.5 21h2m9 0h2"/><path class="dbp-fill" d="M11.3 19.9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm9.4 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/><path class="dbp-stroke" d="M3.5 13.5h4m-2-2-2 2 2 2M28.5 13.5h-4m2-2 2 2-2 2"/></svg>',
    move_vehicle:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-soft" d="M4.5 17.5 7.8 11h12.8l3.4 6.5v5.8H7.5v2.2h-3z"/><path class="dbp-stroke" d="M8.5 17.5h14M10.5 11l1.6-3h5.7l1.7 3M8.5 21h2m9.5 0h2M20 6.5h7.5m-3-3 3 3-3 3"/><path class="dbp-fill" d="M10.4 19.8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm9.2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg>',
    lights_on:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-soft" d="M6 8.5h7.3c4.2 0 7 3.1 7 7.5s-2.8 7.5-7 7.5H6z"/><path class="dbp-stroke" d="M11 9.5v13M23 10l4-2m-4 6h5m-5 4 4 2m-4 2.5 3 2"/></svg>',
    window_open:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-stroke" d="M7 5.5h18v21H7zM9.5 8h13v9h-13zM9.5 20h13M16 8v9"/><path class="dbp-soft" d="M10.5 9h4.3v7h-4.3z"/><path class="dbp-stroke" d="m18 13.5 2.5-2.5m0 0V14m0-3h-3"/></svg>',
    door_open:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-stroke" d="M6 4.5h12v23H6zM8.5 7h7v18h-7zM18 10l8-4v21l-8-5z"/><circle class="dbp-fill" cx="13.2" cy="16" r="1.1"/></svg>',
    damage:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-soft" d="M5 18 8.5 11h15l3.5 7v5.5H5z"/><path class="dbp-stroke" d="M9.5 18h13M11 11l1.7-3h6.6l1.7 3"/><path class="dbp-fill" d="m17 5-3.3 8.2 4-.8-2.3 5.3 4-.7-5.2 9.8 1.3-7-4 .8 2.7-6.1-4 .8z"/></svg>',
    child:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle class="dbp-soft" cx="16" cy="8" r="4"/><path class="dbp-stroke" d="M9 27v-8.5c0-4 3.1-7 7-7s7 3 7 7V27M12 18l-2.5 6m10.5-6 2.5 6M13 27v-7m6 7v-7"/><path class="dbp-fill" d="M13 15.5h6v4h-6z"/></svg>',
    animal:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle class="dbp-soft" cx="9" cy="8.5" r="3"/><circle class="dbp-soft" cx="23" cy="8.5" r="3"/><circle class="dbp-soft" cx="6.5" cy="16" r="2.7"/><circle class="dbp-soft" cx="25.5" cy="16" r="2.7"/><path class="dbp-soft" d="M16 12c5.2 0 8 6.5 8 10.2 0 3.1-3 5-8 5s-8-1.9-8-5C8 18.5 10.8 12 16 12Z"/><path class="dbp-stroke" d="M13.5 20.5c1.7-1.3 3.3-1.3 5 0"/></svg>',
    witness:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-stroke" d="M3.5 16S8.3 8 16 8s12.5 8 12.5 8S23.7 24 16 24 3.5 16 3.5 16Z"/><circle class="dbp-soft" cx="16" cy="16" r="5"/><circle class="dbp-fill" cx="16" cy="16" r="2.3"/><path class="dbp-stroke" d="M25 5.5v5m-2.5-2.5h5"/></svg>',
    other:'<svg viewBox="0 0 32 32" aria-hidden="true"><path class="dbp-soft" d="M5 6h22v16H13l-6 5v-5H5z"/><path class="dbp-stroke" d="M10 11h12m-12 5h8"/><circle class="dbp-fill" cx="23" cy="17" r="1.4"/></svg>'
  });
  if(document.body.classList.contains('demo-mode')&&typeof renderVehicle==='function'&&typeof DEMO_DATA!=='undefined') renderVehicle(DEMO_DATA);
})();
