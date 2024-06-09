import {
    @TextProperty,
	@PercentSliderProperty,
	@SliderProperty,
	@SwitchProperty,
    @ButtonProperty,
    @Vigilant,
    @CheckboxProperty,
    @SelectorProperty,
    @ColorProperty,
    Color
} from '../../modules/Vigilance/index';

// The only parameter that is required is the first, which should be the Module name.
// The other 2 parameters are optional.
// The 2nd parameter is the title of the settings window, seen in the top left above the
// category list.
// The 3rd parameter is an object that determines the sorting order of the categories.

@Vigilant('CookieUtils', 'CookieUtils', {
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ['General'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    getSubcategoryComparator: () => (a, b) => {
        // These function examples will sort the subcategories by the order in the array, so eeeeeee
        // will be above Category.
        const subcategories = ["Ping", "Dungeons"];

        return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) -
            subcategories.indexOf(b.getValue()[0].attributesExt.subcategory);
    },
    getPropertyComparator: () => (a, b) => {
        // And this will put the properties in the order we want them to appear.
        const names = ["Do action!!!", "password", "text", "Color Picker"];

        return names.indexOf(a.attributesExt.name) - names.indexOf(b.attributesExt.name);
    }
})
class Settings {

    @TextProperty({
        name: 'Default Ping Text',
        description: 'What your ping defaults to instead of your name',
        category: 'General',
        subcategory: 'Ping',
    })
    pingText = '';


    @SelectorProperty({
        name: 'Ping shape',
        description: 'Select an option',
        category: 'General',
        subcategory: 'Ping',
        options: ['box', 'solid box', 'funni'],
    })
    pingShape = 0; // Stores index of option

    @SliderProperty({
        name: 'Delete ping waypoints after:',
        description: 'Select a value (0 is forever)',
        category: 'General',
        subcategory: 'Ping',
        min: 0,
        max: 10000
    })
    delete_waypoint_after = 0;

    @SliderProperty({
        name: 'Default ping range',
        description: 'Select a value (0 is infinite)',
        category: 'General',
        subcategory: 'Ping',
        min: 0,
        max: 1000
    })
    pingRange = 0;
    
    @CheckboxProperty({
        name: 'Limit to one ping per player',
        description: 'Not recommended but certainly is an option',
        category: 'General',
        subcategory: 'Ping',
    })
    onePing = false;

    @CheckboxProperty({
        name: 'Limit to one ping of a text',
        description: 'ex: only one LB ping can be shown',
        category: 'General',
        subcategory: 'Ping',
    })
    onePingText = true;

    

    constructor() {
        this.initialize(this);
        this.setCategoryDescription('General', 'CookieUtils Settings');
        this.setSubcategoryDescription('General', 'Dungeons', 'Shows off some nifty property examples.');
    }
}

export default new Settings();
