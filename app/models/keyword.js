import DS from 'ember-data';

export default DS.Model.extend({
  keyword: DS.attr('string'),
  center: DS.belongsTo('center', {async: true}),
  centerKeywords: DS.hasMany('center-keyword', {async: true})
});
