import React from "react";
import { Pencil, Check } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { ProductCombobox } from "./ProductCombobox";

export const renderImageTextProperties = ({
  editImageText,
  setEditImageText,
  imageTextProps,
  setImageTextProps,
  selectedComponent,
  saveStateToComponent,
  onImageTextChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for imageText Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editImageText) {
          // Save all imageText props, including images
          saveStateToComponent(imageTextProps, [
            "title",
            "title_color",
            "button_text",
            "button_color",
            "image",
          ]);
          // Clean up temporary URLs after saving
          // imageTextProps.image URL.revokeObjectURL(url));
        } else {
          // Initialize imageTextProps with current component props
          setImageTextProps({
            title: selectedComponent.props.title || "",
            title_color: selectedComponent.props.title_color || "#000000",
            button_text: selectedComponent.props.button_text || "",
            button_color: selectedComponent.props.button_color || "#ffffff",
            image: selectedComponent.props.image || "",
          });
        }
        setEditImageText((prev) => !prev);
      }}
    >
      {editImageText ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editImageText}
        handleImageUpload={handleImageUpload}
        uploadCase={"imageText"}
      />
      <div className="mt-2 space-y-2">
        {(editImageText
          ? imageTextProps.image
          : selectedComponent.props.image) && (
          <div className="flex items-center space-x-2">
            <img
              src={
                editImageText
                  ? imageTextProps.image
                  : selectedComponent.props.image
              }
              alt="Image Text Background"
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/signupImage.svg";
              }}
            />
            <button
              disabled={!editImageText}
              onClick={() => handleRemoveImage("imageText")}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Title</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={
            editImageText
              ? imageTextProps.title
              : selectedComponent.props.title || ""
          }
          onChange={(e) => {
            if (editImageText) onImageTextChange("title", e.target.value);
          }}
          readOnly={!editImageText}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            !editImageText
              ? "bg-gray-100 cursor-not-allowed"
              : "border-gray-300"
          }`}
        />
        <input
          type="color"
          value={
            editImageText
              ? imageTextProps.title_color
              : selectedComponent.props.title_color || "#000000"
          }
          onChange={(e) => {
            if (editImageText) onImageTextChange("title_color", e.target.value);
          }}
          disabled={!editImageText}
          className="w-12 h-10 p-1 border rounded cursor-pointer"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Buton Text</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={
            editImageText
              ? imageTextProps.button_text
              : selectedComponent.props.button_text || ""
          }
          onChange={(e) => {
            if (editImageText) onImageTextChange("button_text", e.target.value);
          }}
          readOnly={!editImageText}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            !editImageText
              ? "bg-gray-100 cursor-not-allowed"
              : "border-gray-300"
          }`}
        />
        <input
          type="color"
          value={
            editImageText
              ? imageTextProps.button_color
              : selectedComponent.props.button_color || "#ffffff"
          }
          onChange={(e) => {
            if (editImageText)
              onImageTextChange("button_color", e.target.value);
          }}
          disabled={!editImageText}
          className="w-12 h-10 p-1 border rounded cursor-pointer"
        />
      </div>
    </div>
  </div>
);
export const renderBodyHalfProperties = ({
  editBodyHalf,
  setEditBodyHalf,
  bodyHalfProps,
  setBodyHalfProps,
  selectedComponent,
  saveStateToComponent,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for BodyHalf Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editBodyHalf) {
          // Save all BodyHalf props, including images
          saveStateToComponent(bodyHalfProps, ["images"]);
          // Clean up temporary URLs after saving
          bodyHalfProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setBodyHalfProps({
            images: selectedComponent.props.images || [],
          });
        }
        setEditBodyHalf((prev) => !prev);
      }}
    >
      {editBodyHalf ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editBodyHalf}
        handleImageUpload={handleImageUpload}
        uploadCase={"bodyHalf"}
      />
      <div className="mt-2 space-y-2">
        {(editBodyHalf
          ? bodyHalfProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`BodyHalf ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("bodyHalf", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editBodyHalf}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export const renderBrandsProperties = ({
  editBrands,
  setEditBrands,
  brandsProps,
  setBrandsProps,
  selectedComponent,
  saveStateToComponent,
  onBrandsChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for BodyHalf Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editBrands) {
          // Save all Brands props, including images
          saveStateToComponent(brandsProps, [
            "images",
            "bg_img",
            "title",
            "title_color",
          ]);
          // Clean up temporary URLs after saving
          brandsProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setBrandsProps({
            images: selectedComponent.props.images || [],
            bg_img: selectedComponent.props.bg_img || "",
            title: selectedComponent.props.title || "",
            title_color: selectedComponent.props.title_color || "#000000",
          });
        }
        setEditBrands((prev) => !prev);
      }}
    >
      {editBrands ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editBrands}
        handleImageUpload={handleImageUpload}
        uploadCase={"brands"}
      />
      <div className="my-2 space-y-2">
        {(editBrands
          ? brandsProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`Brands ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("brands", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editBrands}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {["bg_img", "title"].map((field) => {
        const colorFieldMap = {
          title: "title_color",
        };
        const colorField = colorFieldMap[field];
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {field.replace("_", " ")}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={
                  editBrands
                    ? brandsProps[field] || ""
                    : selectedComponent.props[field] || ""
                }
                placeholder={`Enter ${field.replace("_", " ")}`}
                onChange={(e) => {
                  if (editBrands) onBrandsChange(field, e.target.value);
                }}
                readOnly={!editBrands}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !editBrands
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              />
              {colorField && (
                <input
                  type="color"
                  value={
                    editBrands
                      ? brandsProps[colorField] || "#000000"
                      : selectedComponent.props[colorField] || "#000000"
                  }
                  onChange={(e) => {
                    if (editBrands) onBrandsChange(colorField, e.target.value);
                  }}
                  disabled={!editBrands}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
export const renderSubCategBrandsProperties = ({
  editsubCategBrands,
  setEditSubCategBrands,
  subCategBrandsProps,
  setSubCategBrandsProps,
  selectedComponent,
  saveStateToComponent,
  onSubCategBrandsChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for BodyHalf Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editsubCategBrands) {
          // Save all BodyHalf props, including images
          saveStateToComponent(subCategBrandsProps, [
            "images",
            "title",
            "title_color",
          ]);
          // Clean up temporary URLs after saving
          subCategBrandsProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setSubCategBrandsProps({
            images: selectedComponent.props.images || [],
            title: selectedComponent.props.title || "",
            title_color: selectedComponent.props.title_color || "#000000",
          });
        }
        setEditSubCategBrands((prev) => !prev);
      }}
    >
      {editsubCategBrands ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editsubCategBrands}
        handleImageUpload={handleImageUpload}
        uploadCase={"subCategBrands"}
      />
      <div className="my-2 space-y-2">
        {(editsubCategBrands
          ? subCategBrandsProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`subCategBrands ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("subCategBrands", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editsubCategBrands}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {["title"].map((field) => {
        const colorFieldMap = {
          title: "title_color",
        };
        const colorField = colorFieldMap[field];
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {field.replace("_", " ")}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={
                  editsubCategBrands
                    ? subCategBrandsProps[field] || ""
                    : selectedComponent.props[field] || ""
                }
                placeholder={`Enter ${field.replace("_", " ")}`}
                onChange={(e) => {
                  if (editsubCategBrands)
                    onSubCategBrandsChange(field, e.target.value);
                }}
                readOnly={!editsubCategBrands}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !editsubCategBrands
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              />
              {colorField && (
                <input
                  type="color"
                  value={
                    editsubCategBrands
                      ? subCategBrandsProps[colorField] || "#000000"
                      : selectedComponent.props[colorField] || "#000000"
                  }
                  onChange={(e) => {
                    if (editsubCategBrands)
                      onSubCategBrandsChange(colorField, e.target.value);
                  }}
                  disabled={!editsubCategBrands}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
export const renderBannerProperties = ({
  editBanner,
  setEditBanner,
  bannerProps,
  setBannerProps,
  selectedComponent,
  saveStateToComponent,
  onBannerChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for Banner Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editBanner) {
          // Save all banner props, including images
          saveStateToComponent(bannerProps, ["autoPlay", "interval", "images"]);
          // Clean up temporary URLs after saving
          bannerProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setBannerProps({
            autoPlay: selectedComponent.props.autoPlay || false,
            interval: selectedComponent.props.interval || 3000,
            images: selectedComponent.props.images || [],
          });
        }
        setEditBanner((prev) => !prev);
      }}
    >
      {editBanner ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editBanner}
        handleImageUpload={handleImageUpload}
        uploadCase={"banner"}
      />
      <div className="mt-4 space-y-2">
        {(editBanner
          ? bannerProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("banner", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editBanner}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Auto Play</label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={
            editBanner
              ? bannerProps.autoPlay
              : selectedComponent.props.autoPlay || false
          }
          onChange={(e) => {
            if (editBanner) onBannerChange("autoPlay", e.target.checked);
          }}
          disabled={!editBanner}
          className={`mr-2 ${!editBanner ? "cursor-not-allowed" : ""}`}
        />
        Enable auto-play
      </label>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Interval (ms)</label>
      <input
        type="number"
        value={
          editBanner
            ? bannerProps.interval
            : selectedComponent.props.interval || 3000
        }
        onChange={(e) => {
          if (editBanner) onBannerChange("interval", parseInt(e.target.value));
        }}
        readOnly={!editBanner}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          !editBanner ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
        }`}
        min="1000"
        step="500"
      />
    </div>
  </div>
);
export const renderBodyPlainProperties = ({
  editBodyPlain,
  setEditBodyPlain,
  bodyPlainProps,
  setBodyPlainProps,
  selectedComponent,
  saveStateToComponent,
  onBodyPlainChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for Banner Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editBodyPlain) {
          // Save all banner props, including images
          saveStateToComponent(bodyPlainProps, [
            "autoPlay",
            "interval",
            "images",
          ]);
          // Clean up temporary URLs after saving
          bodyPlainProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setBodyPlainProps({
            autoPlay: selectedComponent.props.autoPlay || false,
            interval: selectedComponent.props.interval || 3000,
            images: selectedComponent.props.images || [],
          });
        }
        setEditBodyPlain((prev) => !prev);
      }}
    >
      {editBodyPlain ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editBodyPlain}
        handleImageUpload={handleImageUpload}
        uploadCase={"bodyPlain"}
      />
      <div className="mt-2 space-y-2">
        {(editBodyPlain
          ? bodyPlainProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`BodyPlain ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("bodyPlain", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editBodyPlain}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Auto Play</label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={
            editBodyPlain
              ? bodyPlainProps.autoPlay
              : selectedComponent.props.autoPlay || false
          }
          onChange={(e) => {
            if (editBodyPlain) onBodyPlainChange("autoPlay", e.target.checked);
          }}
          disabled={!editBodyPlain}
          className={`mr-2 ${!editBodyPlain ? "cursor-not-allowed" : ""}`}
        />
        Enable auto-play
      </label>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Interval (ms)</label>
      <input
        type="number"
        value={
          editBodyPlain
            ? bodyPlainProps.interval
            : selectedComponent.props.interval || 3000
        }
        onChange={(e) => {
          if (editBodyPlain)
            onBodyPlainChange("interval", parseInt(e.target.value));
        }}
        readOnly={!editBodyPlain}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          !editBodyPlain ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
        }`}
        min="1000"
        step="500"
      />
    </div>
  </div>
);
export const renderBodyRoundProperties = ({
  editBodyRound,
  setEditBodyRound,
  bodyRoundProps,
  setBodyRoundProps,
  selectedComponent,
  saveStateToComponent,
  onBodyRoundChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button for Banner Props */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editBodyRound) {
          // Save all banner props, including images
          saveStateToComponent(bodyRoundProps, [
            "autoPlay",
            "interval",
            "images",
          ]);
          // Clean up temporary URLs after saving
          bodyRoundProps.images.forEach((url) => URL.revokeObjectURL(url));
        } else {
          // Initialize bannerProps with current component props
          setBodyRoundProps({
            autoPlay: selectedComponent.props.autoPlay || false,
            interval: selectedComponent.props.interval || 3000,
            images: selectedComponent.props.images || [],
          });
        }
        setEditBodyRound((prev) => !prev);
      }}
    >
      {editBodyRound ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    <div>
      <label className="block text-sm font-medium mb-2">Images</label>
      <UploadDropzone
        edit={editBodyRound}
        handleImageUpload={handleImageUpload}
        uploadCase={"bodyRound"}
      />
      <div className="mt-2 space-y-2">
        {(editBodyRound
          ? bodyPlainProps.images
          : selectedComponent.props.images || []
        ).map((image, index) => (
          <div key={`image-${index}`} className="flex items-center space-x-2">
            <img
              src={image}
              alt={`BodyRound ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = "/Images/sampleImg.png";
              }}
            />
            <button
              onClick={() => handleRemoveImage("bodyPlain", index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={!editBodyRound}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Auto Play</label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={
            editBodyRound
              ? bodyRoundProps.autoPlay
              : selectedComponent.props.autoPlay || false
          }
          onChange={(e) => {
            if (editBodyRound) onBodyRoundChange("autoPlay", e.target.checked);
          }}
          disabled={!editBodyRound}
          className={`mr-2 ${!editBodyPlain ? "cursor-not-allowed" : ""}`}
        />
        Enable auto-play
      </label>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Interval (ms)</label>
      <input
        type="number"
        value={
          editBodyRound
            ? bodyRoundProps.interval
            : selectedComponent.props.interval || 3000
        }
        onChange={(e) => {
          if (editBodyRound)
            onBodyRoundChange("interval", parseInt(e.target.value));
        }}
        readOnly={!editBodyRound}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          !editBodyRound ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
        }`}
        min="1000"
        step="500"
      />
    </div>
  </div>
);
export const renderImageRowProperties = ({
  selectedComponent,
  onUpdateComponent,
  imageRowEditIndex,
  setImageRowEditIndex,
  imageRowItem,
  setImageRowItem,
  addItem,
  removeItem,
  editItem,
  saveItem,
  cancelEdit,
}) => (
  <div className="space-y-4 bg-gray-50 border-l border-gray-200 w-80 h-full overflow-y-auto p-4">
    <div className=" space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items ({selectedComponent.props.items.length})
        </label>
        <button
          onClick={() => addItem(selectedComponent, onUpdateComponent)}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-2 space-x-4 mt-4 max-h-96 overflow-y-auto">
        {selectedComponent.props.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            {imageRowEditIndex === index ? (
              <div className="space-y-2">
                <UploadDropzone
                  edit={true}
                  uploadCase="item"
                  handleItemImageUpload={(fileOrUrl) => {
                    if (typeof fileOrUrl === "string") {
                      // URL case
                      setImageRowItem((prev) => ({
                        ...prev,
                        image: fileOrUrl,
                      }));
                    } else {
                      // File case → convert to base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImageRowItem((prev) => ({
                          ...prev,
                          image: reader.result,
                        }));
                      };
                      reader.readAsDataURL(fileOrUrl);
                    }
                  }}
                />
                <input
                  type="text"
                  placeholder="Text"
                  value={imageRowItem.text}
                  onChange={(e) =>
                    setImageRowItem((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      saveItem(
                        imageRowEditIndex,
                        imageRowItem,
                        setImageRowEditIndex,
                        setImageRowItem,
                        selectedComponent,
                        onUpdateComponent
                      )
                    }
                    className="flex-1 px-3 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      cancelEdit(setImageRowEditIndex, setImageRowItem)
                    }
                    className="flex-1 px-3 py-2 rounded bg-white text-blue-500 text-sm font-medium border-2 border-blue-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={item.image}
                    alt={item.text}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/Images/sampleImg.png";
                    }}
                  />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editItem(
                        index,
                        setImageRowEditIndex,
                        setImageRowItem,
                        selectedComponent
                      )
                    }
                    className="flex-1 px-3 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      removeItem(index, selectedComponent, onUpdateComponent)
                    }
                    className="flex-1 px-3 py-2 rounded bg-white text-blue-500 text-sm font-medium border-2 border-blue-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
export const renderSubHeaderGridProperties = ({
  selectedComponent,
  onUpdateComponent,
  subHeaderGridEditIndex,
  setSubHeaderGridEditIndex,
  subHeaderGridItem,
  setSubHeaderGridItem,
  addItem,
  removeItem,
  editItem,
  saveItem,
  cancelEdit,
}) => (
  <div className="space-y-4 bg-gray-50 border-l border-gray-200 w-80 h-full overflow-y-auto p-4">
    <div className="space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items ({selectedComponent.props.items.length})
        </label>
        <button
          onClick={() => addItem(selectedComponent, onUpdateComponent)}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-2 space-x-4 mt-4 max-h-96 overflow-y-auto">
        {selectedComponent.props.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            {subHeaderGridEditIndex === index ? (
              <div className="space-y-2">
                <UploadDropzone
                  edit={true}
                  uploadCase="item"
                  handleItemImageUpload={(fileOrUrl) => {
                    if (typeof fileOrUrl === "string") {
                      // URL case
                      setSubHeaderGridItem((prev) => ({
                        ...prev,
                        image: fileOrUrl,
                      }));
                    } else {
                      // File case → convert to base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSubHeaderGridItem((prev) => ({
                          ...prev,
                          image: reader.result,
                        }));
                      };
                      reader.readAsDataURL(fileOrUrl);
                    }
                  }}
                />

                <input
                  type="text"
                  placeholder="Text"
                  value={subHeaderGridItem.text}
                  onChange={(e) =>
                    setSubHeaderGridItem((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      saveItem(
                        subHeaderGridEditIndex,
                        subHeaderGridItem,
                        setSubHeaderGridEditIndex,
                        setSubHeaderGridItem,
                        selectedComponent,
                        onUpdateComponent
                      )
                    }
                    className="flex-1 px-3 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      cancelEdit(
                        setSubHeaderGridEditIndex,
                        setSubHeaderGridItem
                      )
                    }
                    className="flex-1 px-3 py-2 rounded bg-white text-blue-500 text-sm font-medium border-2 border-blue-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={item.image}
                    alt={item.text}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/Images/sampleImg.png";
                    }}
                  />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editItem(
                        index,
                        setSubHeaderGridEditIndex,
                        setSubHeaderGridItem,
                        selectedComponent
                      )
                    }
                    className="flex-1 px-3 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      removeItem(index, selectedComponent, onUpdateComponent)
                    }
                    className="flex-1 px-3 py-2 rounded bg-white text-blue-500 text-sm font-medium border-2 border-blue-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
export const renderSubBodyGridProperties = ({
  selectedComponent,
  onUpdateComponent,
  subBodyGridEditIndex,
  setSubBodyGridEditIndex,
  subBodyGridItem,
  setSubBodyGridItem,
  addItem,
  removeItem,
  editItem,
  saveItem,
  cancelEdit,
}) => (
  <div className="space-y-4 bg-gray-50 border-l border-gray-200 w-80 h-full overflow-y-auto p-4">
    <div className="space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items ({selectedComponent.props.items.length})
        </label>
        <button
          onClick={() => addItem(selectedComponent, onUpdateComponent)}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-2 space-x-4 mt-4 max-h-96 overflow-y-auto">
        {selectedComponent.props.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            {subBodyGridEditIndex === index ? (
              <div className="space-y-2">
                <UploadDropzone
                  edit={true}
                  uploadCase="item"
                  handleItemImageUpload={(fileOrUrl) => {
                    if (typeof fileOrUrl === "string") {
                      // URL case
                      setSubBodyGridItem((prev) => ({
                        ...prev,
                        image: fileOrUrl,
                      }));
                    } else {
                      // File case → convert to base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSubBodyGridItem((prev) => ({
                          ...prev,
                          image: reader.result,
                        }));
                      };
                      reader.readAsDataURL(fileOrUrl);
                    }
                  }}
                />

                <input
                  type="text"
                  placeholder="Text"
                  value={subBodyGridItem.text}
                  onChange={(e) =>
                    setSubBodyGridItem((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  className="w-full h-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      saveItem(
                        subBodyGridEditIndex,
                        subBodyGridItem,
                        setSubBodyGridEditIndex,
                        setSubBodyGridItem,
                        selectedComponent,
                        onUpdateComponent
                      )
                    }
                    className="flex-1 h-full bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      cancelEdit(setSubBodyGridEditIndex, setSubBodyGridItem)
                    }
                    className="flex-1 h-full bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={item.image}
                    alt={item.text}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/Images/sampleImg.png";
                    }}
                  />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editItem(
                        index,
                        setSubBodyGridEditIndex,
                        setSubBodyGridItem,
                        selectedComponent
                      )
                    }
                    className="flex-1 h-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      removeItem(index, selectedComponent, onUpdateComponent)
                    }
                    className="flex-1 h-full bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
export const renderVideoTextProperties = ({
  editVideoText,
  setEditVideoText,
  videoTextProps,
  setVideoTextProps,
  selectedComponent,
  saveStateToComponent,
  onVideoTextChange,
}) => (
  <div className="space-y-4 p-4 bg-gray-50">
    {/* Edit / Save Toggle Button */}
    <button
      className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
      onClick={() => {
        if (editVideoText) {
          saveStateToComponent(videoTextProps, [
            "video_url",
            "title_color",
            "button_text",
            "button_color",
          ]);
        } else {
          setVideoTextProps({
            video_url: selectedComponent.props.video_url || "",
            title: selectedComponent.props.title || "",
            title_color: selectedComponent.props.title_color || "#000000",
            button_text: selectedComponent.props.button_text || "",
            button_color: selectedComponent.props.button_color || "#ffffff",
          });
        }
        setEditVideoText((prev) => !prev);
      }}
    >
      {editVideoText ? (
        <div className="flex justify-center items-center">
          <Check size={16} />
          <span className="ml-2">Save</span>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Pencil size={16} />
          <span className="ml-2">Edit</span>
        </div>
      )}
    </button>

    {["video_url", "title", "button_text"].map((field) => {
      const colorFieldMap = {
        title: "title_color",
        button_text: "button_color",
      };
      const colorField = colorFieldMap[field];
      return (
        <div key={field}>
          <label className="block text-sm font-medium mb-2 capitalize">
            {field.replace("_", " ")}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={
                editVideoText
                  ? videoTextProps[field] || ""
                  : selectedComponent.props[field] || ""
              }
              placeholder={`Enter ${field.replace("_", " ")}`}
              onChange={(e) => {
                if (editVideoText) onVideoTextChange(field, e.target.value);
              }}
              readOnly={!editVideoText}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !editVideoText
                  ? "bg-gray-100 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
            {colorField && (
              <input
                type="color"
                value={
                  editVideoText
                    ? videoTextProps[colorField] || "#000000"
                    : selectedComponent.props[colorField] || "#000000"
                }
                onChange={(e) => {
                  if (editVideoText)
                    onVideoTextChange(colorField, e.target.value);
                }}
                disabled={!editVideoText}
                className="w-12 h-10 p-1 border rounded cursor-pointer"
              />
            )}
          </div>
        </div>
      );
    })}
  </div>
);
export const renderProductsGridProperties = ({
  gridTitle,
  handleGridTitleChange,
  selectedProductId,
  setSelectedProductId,
  sampleProducts,
  addProductToGrid,
  removeProductFromGrid,
  selectedComponent,
  saveStateToComponent,
  products,
  setProductSearchTerm,
  loading,
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 border-l border-gray-200 w-80 h-full overflow-y-auto p-4">
      <div className="space-x-4">
        {/* Grid Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grid Title
          </label>
          <input
            type="text"
            placeholder="Enter grid title..."
            value={gridTitle}
            onChange={handleGridTitleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Products
          </label>
          <div className="space-y-2">
            {/* Shadcn Select Component */}
            {/* <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a product to add...</option>
              {sampleProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - SAR {product.pricelist_price}
                </option>
              ))}
            </select> */}
            <ProductCombobox
              products={products}
              selectedProduct={selectedProductId}
              setSelectedProduct={setSelectedProductId}
              setSearchTerm={setProductSearchTerm}
              loading={loading}
            />

            {/* Add Product Button */}
            <button
              onClick={addProductToGrid}
              disabled={!selectedProductId}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              + Add Selected Product
            </button>
          </div>
        </div>

        {/* Current Products List */}
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Products ({(selectedComponent.props.products || []).length})
          </label>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(selectedComponent.props.products || []).length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <span className="text-2xl block mb-2">📦</span>
                <p className="text-sm">No products added yet</p>
              </div>
            ) : (
              (selectedComponent.props.products || []).map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {product.name}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">
                            {product.pricelist_price !== product.list_price ? (
                              <>
                                <span className="line-through text-gray-400">
                                  SAR {product.list_price}
                                </span>{" "}
                                <span className="text-red-600">
                                  SAR {product.pricelist_price}
                                </span>
                              </>
                            ) : (
                              <span>SAR {product.list_price}</span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock:</span>
                          <span
                            className={
                              product.quantity > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {product.quantity > 0
                              ? `${product.quantity} available`
                              : "Out of stock"}
                          </span>
                        </div>
                        {product.rating_count && (
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span className="flex items-center">
                              ⭐ {product.rating_count}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeProductFromGrid(product.id)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t py-4">
          <div className="space-y-2 space-x-1 pr-4">
            <button
              //   onClick={() => {
              //     // Add all sample products
              //     const existingProducts = selectedComponent.props.products || [];
              //     const existingIds = existingProducts.map((p) => p.id);
              //     const newProducts = sampleProducts.filter(
              //       (p) => !existingIds.includes(p.id)
              //     );
              //     const allProducts = [...existingProducts, ...newProducts];
              //     saveStateToComponent({ products: allProducts }, ["products"]);
              //   }}
              //   className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
              onClick={() => {
                const existingProducts = selectedComponent.props.products || [];
                const existingIds = existingProducts.map((p) => p.id);
                const newProducts = products.filter(
                  (p) => !existingIds.includes(p.id)
                );
                const allProducts = [...existingProducts, ...newProducts];
                saveStateToComponent({ products: allProducts }, ["products"]);
              }}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
            >
              Add All
            </button>
            <button
              onClick={() => {
                saveStateToComponent({ products: [] }, ["products"]);
              }}
              className="w-full text-blue-500 bg-white px-3 py-2 rounded text-sm border-2 border-blue-500"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const renderUnknownComponent = () => (
  <div className="text-sm text-gray-500">
    No editable properties available for this component.
  </div>
);
