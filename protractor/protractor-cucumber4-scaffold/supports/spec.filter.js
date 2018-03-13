var fs = require('fs-extra');
var glob = require('glob');
var _ = require("lodash");
var featureParser = require('cucumber/lib/cli/feature_parser').default.parse;
var ScenarioFilter = require('cucumber/lib/scenario_filter').default;

var filter_by_tag = module.exports = function(config) {

    let tagExpression = config.cucumberOpts.tags;
    let priorities = config.cucumberOpts.priorities;

    let scenarioFilterOptions = {
        tagExpression: tagExpression
    };
    let scenarioFilter = new ScenarioFilter(scenarioFilterOptions);

    let specs = config.specs;

    let features = {};

    specs.forEach(function(item) {
        let files = glob.sync(item);

        files.forEach(function(featurePath) {

            let source = fs.readFileSync(featurePath, 'utf8');
            // filter feature by tag
            let result = featureParser({
                scenarioFilter: scenarioFilter,
                source: source,
                uri: featurePath
            });

            if (result && result.scenarios.length > 0) {
                // group feature by priority
                group_by_priority(source, featurePath, priorities, features);
            }
        });
    });

    // order feature files by priority
    config.specs = _.chain(features).toPairs()
        .sortBy([function(item) {
            return item[1];
            }])
        .reverse()
        .map(function(item) {
            return item[0]
        }).value();

    console.log('Matched features: ');
    console.dir(config.specs);

    return config;
};

var group_by_priority = function(source, featurePath, priorities, features) {

    features[featurePath] = 0;

    if (priorities) {
        let keys = Object.keys(priorities);

        keys.forEach(function(key) {
            let priority = key * 1;
            let tags = priorities[key];

            let tagExpression = tags.map(function(tag) {
                return '(' + tag + ')';
            }).join(' or ');

            let priorityFilter = new ScenarioFilter({
                tagExpression: tagExpression
            });

            let result = featureParser({
                scenarioFilter: priorityFilter,
                source: source,
                uri: featurePath
            });
            if (result && result.scenarios.length > 0) {
                features[featurePath] = priority;
            }
        });
    }
};