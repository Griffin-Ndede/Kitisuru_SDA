export const activityFields = {
    Child_dedication: [
        {
            name: "child_name",
            type: "text",
            label: "Full Name of Child",
            placeholder: "Enter child's full name",
            required: true,
        },
        {
            name: "child_dob",
            type: "date",
            label: "Date of Birth",
            required: true,
        },
        {
            name: "child_gender",
            type: "select",
            label: "Gender",
            placeholder: "Select gender",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },

        /* Parents Section */
        {
            name: "mother_name",
            type: "text",
            label: "Mother's Full Name",
            placeholder: "Enter mother's full name",
        },
        {
            name: "mother_phone",
            type: "text",
            label: "Mother's Phone Number",
            placeholder: "Enter mother's phone number",
        },
        {
            name: "mother_email",
            type: "email",
            label: "Mother's Email (optional)",
            placeholder: "Enter mother's email",
        },

        {
            name: "father_name",
            type: "text",
            label: "Father's Full Name",
            placeholder: "Enter father's full name",
        },
        {
            name: "father_phone",
            type: "text",
            label: "Father's Phone Number",
            placeholder: "Enter father's phone number",
        },
        {
            name: "father_email",
            type: "email",
            label: "Father's Email (optional)",
            placeholder: "Enter father's email",
        },
    ],

    commitment_form: [
        {
            name: "Full_name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
        },
        {
            name: "Email",
            type: "email",
            label: "Email address",
            placeholder: "Enter your email address",
        },
        {
            name: "Phone_number",
            type: "text",
            label: "Phone number",
            placeholder: "Enter your phone number"
        },
        {
            name: "commitment_type",
            type: "checkbox_group",
            label: "What would you like to do?",
            options: [
                {
                    label: "Renew my commitment to God",
                    value: "renew_commitment",
                },
                {
                    label: "Join a Bible study class",
                    value: "bible_study",
                },
                {
                    label: "Be baptised",
                    value: "baptism",
                },
                {
                    label: "Talk to the pastor",
                    value: "talk_to_pastor",
                },
                {
                    label: "Submit a prayer request",
                    value: "prayer_request",
                },
            ],
            required: true,
        },
        {
            name: "message",
            type: "textarea",
            label: "Additional Information / Prayer Request",
            placeholder: "Share any details you would like us to know",
        },
    ],
    membership_transfer: [
        {
            name: "Full_name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
        },
        {
            name: "Email",
            type: "email",
            label: "Email address",
            placeholder: "Enter your email address",
        },
        {
            name: "Phone_number",
            type: "text",
            label: "Phone number",
            placeholder: "Enter your phone number"
        },
        {
            name: "transfer_type",
            type: "radio",
            label: "What would you like to do?",
            options: [
                {
                    label: "Transfer my membership from another church to Newlife SDA Church Nairobi",
                    value: "transfer_in",
                },
                {
                    label: "Transfer my membership from Newlife SDA Church Nairobi to another church",
                    value: "transfer_out",
                },
            ],
            required: true,
        },

        // FROM CHURCH
        {
            name: "from_church_name",
            type: "text",
            label: "Church You Are Transferring From – Church Name",
            placeholder: "Enter church name",
        },
        {
            name: "from_church_district",
            type: "text",
            label: "Church You Are Transferring From – District",
            placeholder: "Enter district",
        },
        {
            name: "from_church_conference",
            type: "text",
            label: "Church You Are Transferring From – Conference",
            placeholder: "Enter conference",
        },

        // TO CHURCH
        {
            name: "to_church_name",
            type: "text",
            label: "Church You Are Transferring To – Church Name",
            placeholder: "Enter church name",
        },
        {
            name: "to_church_district",
            type: "text",
            label: "Church You Are Transferring To – District",
            placeholder: "Enter district",
        },
        {
            name: "to_church_conference",
            type: "text",
            label: "Church You Are Transferring To – Conference",
            placeholder: "Enter conference",
        },

        {
            name: "additional_notes",
            type: "textarea",
            label: "Additional Information (optional)",
            placeholder: "Any additional details we should know",
        },

    ],
    
        ministry_membership: [
            {
                name: "Full_name",
                type: "text",
                label: "Full name",
                placeholder: "John Doe"
            },
            {
                name: "Phone_number",
                type: "text",
                label: "Phone number",
                placeholder: "+254 712 345 678"
            },
            {
                name: "Email_address",
                type: "email",
                label: "Email address",
                placeholder: "johndoe@gmail.com"
            },
            {
                name: "Ministry",
                type:"select",
                label: "Ministry",
                options: [
                { label: "Music ministry", value: "music" },
                { label: "Children ministry", value: "children" },
                {label: "Health ministry", value: "health"}
            ],

            }
        ]
};