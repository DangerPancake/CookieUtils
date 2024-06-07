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
        name: 'e',
        description: 'amount in ms - set to 0 to never delete it',
        category: 'General',
        subcategory: 'Dungeons',
        placeholder: 'poopy',
        triggerActionOnInitialization: false,
    })
    textInput = '';

    @TextProperty({
        name: 'password',
        description: 'Example of text input that uses protected',
        category: 'General',
        subcategory: 'Dungeons',
        protected: true,
    })
    password = '';

    @ColorProperty({
        name: 'Color Picker',
        description: 'Pick a color! (hopefully...)',
        category: 'General',
        subcategory: 'Dungeons',
    })
    myColor = Color.BLUE;

    @SelectorProperty({
        name: 'Selector',
        description: 'Select an option',
        category: 'General',
        subcategory: 'Ping',
        options: ['opt1', 'opty2', 'third option'],
    })
    myOptions = 0; // Stores index of option

    @SliderProperty({
        name: 'Delete ping waypoints after:',
        description: 'Select a value',
        category: 'General',
        subcategory: 'Ping',
        min: 0,
        max: 10000
    })
    delete_waypoint_after = 0;


    @SwitchProperty({
        name: 'Do action!!!',
        description: 'toggle the checkbox in Not general! tab!',
        category: 'General',
        subcategory: 'Dungeons',
        placeholder: 'Activate',
    })
    switch = false;
    
    @CheckboxProperty({
        name: 'Checkbox',
        description: 'Check this box',
        category: 'Not general!',
    })
    myCheckbox = false;
    

    constructor() {
        this.initialize(this);
        this.registerListener('e', newText => {
            console.log(`Text changed to ${newText}`);
        });

        this.addDependency("Checkbox", "Do action!!!")
        this.setCategoryDescription('General', 'CookieUtils Settings');
        this.setSubcategoryDescription('General', 'Dungeons', 'Shows off some nifty property examples.');
    }
}

export default new Settings();
