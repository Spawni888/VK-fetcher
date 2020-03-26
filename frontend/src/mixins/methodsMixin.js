export default {
    methods: {
        defineSex(value) {
            switch (value) {
            case 2:
                return 'Male';
            case 1:
                return 'Female';
            default:
                return 'No info';
            }
        },
        defineAge(value) {
            if (!value) return 'No info';
            const bdate = value.split('.');

            if (bdate.length === 3) {
                const [day, month, year] = bdate;
                const ageInMs = new Date() - new Date(year, month, day + 1).getTime();
                const ageDate = new Date(ageInMs);

                return Math.abs(ageDate.getUTCFullYear() - 1970);
            }
            return 'No info';
        },
    },
};
