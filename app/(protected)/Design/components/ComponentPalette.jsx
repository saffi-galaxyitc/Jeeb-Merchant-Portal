const ComponentPalette = ({ onAddComponent }) => {
  const componentCategories = [
    {
      name: "Content",
      components: [
        {
          type: "banner",
          name: "Banner",
          icon: "/Images/bannerLogo.gif",
          description: "Promotional banner with image and auto-play",
        },
        {
          type: "imageRow",
          name: "Image Row",
          icon: "/Images/imageRowLogo.gif",
          description:
            "Horizontally scrollable 2 rows of overlapping fully rounded image blocks with title texts",
        },
        {
          type: "subHeaderGrid",
          name: "Sub Header Grid",
          icon: "/Images/subHeaderGridLogo.gif",
          description:
            "Horizontally scrollable 2 rows of rounded border image blocks with title texts",
        },
        {
          type: "videoText",
          name: "Video Text",
          icon: "/Images/videoTextLogo.gif",
          description: "Video with text and button",
        },
        {
          type: "imageText",
          name: "Image Text",
          icon: "/Images/imageTextLogo.gif",
          description: "Image with text and button",
        },
        {
          type: "bodyHalf",
          name: "Body Half",
          icon: "/Images/bodyHalfLogo.gif",
          description: "Images that slide through",
        },
        {
          type: "subBodyGrid",
          name: "Sub Body Grid",
          icon: "/Images/subBodyGridLogo.gif",
          description: "Images that slide through along with titles",
        },
        {
          type: "bodyPlain",
          name: "Body Plain",
          icon: "/Images/bodyPlainLogo.gif",
          description:
            "Promotional slider(plain slides) with images and auto-play",
        },
        {
          type: "bodyRound",
          name: "Body Round",
          icon: "/Images/bodyRoundLogo.gif",
          description:
            "Promotional slider(rounded slides) with images and auto-play",
        },
        {
          type: "brands",
          name: "Brands",
          icon: "/Images/brandsLogo.gif",
          description:
            "Brands slider(rounded rectangular slides) with images, title and background image",
        },
        {
          type: "subCategBrands",
          name: "Sub Category Brands",
          icon: "/Images/bodyHalfLogo.gif",
          description:
            "Sub Category Brands slider(rounded rectangular slides) with images and title",
        },
        {
          type: "productsGrid",
          name: "Products Grid",
          icon: "/Images/productsGridLogo.gif",
          description: "It includes horizontally scrollable featured products",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {componentCategories.map((category) => (
        <div key={category.name}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.components.map((component) => (
              <div
                key={component.type}
                onClick={() => onAddComponent(component.type)}
                className="relative w-32 h-32 border-2 border-dashed border-blue-600 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 group"
              >
                <h4 className="absolute top-1 left-1 font-medium text-xs text-gray-800 bg-white px-2 py-1 rounded hidden group-hover:block transition-opacity duration-200">
                  {component.name}
                </h4>
                <img
                  src={component.icon}
                  alt={`${component.name} icon`}
                  className="w-24 h-24 object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-sm text-blue-800 mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Drag components to reorder them</li>
          <li>• Preview your design frequently</li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentPalette;
