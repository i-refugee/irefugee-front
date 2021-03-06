import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
	authorizer: 'authorizer:refugee',
	host: '',
	pathForType: function(type) {
		let underscored = Ember.String.underscore(type);
		return Ember.String.pluralize(underscored);
	}
});
