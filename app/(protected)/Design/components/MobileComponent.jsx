import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";
const MobileComponent = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onImageUpload,
  isPreview = false,
}) => {
  const bannerAutoPlayRef = useRef(component.props.autoPlay);
  const bannerIntervalRef = useRef(component.props.interval);
  const bodyPlainAutoPlayRef = useRef(component.props.autoPlay);
  const bodyPlainIntervalRef = useRef(component.props.interval);

  // Keep refs in sync with latest props at runtime
  useEffect(() => {
    bannerAutoPlayRef.current = component.props.autoPlay;
    bannerIntervalRef.current = component.props.interval;
  }, [component.props.autoPlay, component.props.interval]);
  useEffect(() => {
    bodyPlainAutoPlayRef.current = component.props.autoPlay;
    bodyPlainIntervalRef.current = component.props.interval;
  }, [component.props.autoPlay, component.props.interval]);
  const [bannerSliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBannerTimeout = () => clearTimeout(timeout);

        const setBannerTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bannerAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bannerIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBannerTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBannerTimeout();
          });

          setBannerTimeout();
        });

        slider.on("dragStarted", clearBannerTimeout);
        slider.on("animationEnded", setBannerTimeout);
        slider.on("updated", setBannerTimeout);
      },
    ]
  );
  const [bodyPlainSliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBodyPlainTimeout = () => clearTimeout(timeout);

        const setBodyPlainTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bodyPlainAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bodyPlainIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBodyPlainTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBodyPlainTimeout();
          });

          setBodyPlainTimeout();
        });

        slider.on("dragStarted", clearBodyPlainTimeout);
        slider.on("animationEnded", setBodyPlainTimeout);
        slider.on("updated", setBodyPlainTimeout);
      },
    ]
  );
  const [bodyRoundSliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        perView: 1,
        spacing: 15,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBodyPlainTimeout = () => clearTimeout(timeout);

        const setBodyPlainTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bodyPlainAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bodyPlainIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBodyPlainTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBodyPlainTimeout();
          });

          setBodyPlainTimeout();
        });

        slider.on("dragStarted", clearBodyPlainTimeout);
        slider.on("animationEnded", setBodyPlainTimeout);
        slider.on("updated", setBodyPlainTimeout);
      },
    ]
  );
  const [subCategBrandsSliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 15,
    },
    perMove: 2,
    mode: "snap",
  });
  const [brandsSliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 15,
    },
    perMove: 2,
    mode: "snap",
  });
  const [bodyHalfSliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 15,
    },
  });
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(component.id);
  };
  const renderImageRow = () => {
    // Split items into two rows for the two-row layout
    const topRowItems = component.props.items.slice(
      0,
      Math.ceil(component.props.items.length / 2)
    );
    const bottomRowItems = component.props.items.slice(
      Math.ceil(component.props.items.length / 2)
    );

    return (
      <div
        className=" bg-transparent"
        style={{
          padding: "20px 20px",
          minHeight: "200px",
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>

        {component.props.items && component.props.items.length >= 6 ? (
          <div
            className="space-y-6 overflow-x-auto scrollbar-hide bg-transparent -mt-14"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Top Row */}
            <div className="relative">
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {topRowItems.map((item, index) => (
                  <div
                    key={`top-${index}`}
                    className="flex flex-col items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="rounded-full overflow-hidden mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={`${item.text}`}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          e.target.src = "/Images/sampleImg.png";
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 text-center font-medium leading-tight"
                      style={{
                        maxWidth: "75px",
                        fontSize: "11px",
                        lineHeight: "13px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div>
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {bottomRowItems.map((item, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="flex flex-col items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="rounded-full overflow-hidden mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={`${item.text}`}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          e.target.src = "/Images/sampleImg.png";
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 text-center font-medium leading-tight"
                      style={{
                        maxWidth: "75px",
                        fontSize: "11px",
                        lineHeight: "13px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">🖼️</span>
              <p className="text-sm">
                Add images and titles for each item in the properties panel
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderSubHeaderGrid = () => {
    // Split items into two rows for the two-row layout
    const topRowItems = component.props.items.slice(
      0,
      Math.ceil(component.props.items.length / 2)
    );
    const bottomRowItems = component.props.items.slice(
      Math.ceil(component.props.items.length / 2)
    );

    return (
      <div
        className=" bg-transparent"
        style={{
          padding: "20px 0px",
          minHeight: "200px",
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>

        {component.props.items && component.props.items.length >= 6 ? (
          <div
            className="space-y-6 overflow-x-auto scrollbar-hide bg-transparent"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Top Row */}
            <div className="relative">
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {topRowItems.map((item, index) => (
                  <div
                    key={`top-${index}`}
                    className="flex flex-col items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="rounded-lg overflow-hidden mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={`${item.text}`}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          e.target.src = "/Images/sampleImg.png";
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 text-center font-medium leading-tight"
                      style={{
                        maxWidth: "75px",
                        fontSize: "11px",
                        lineHeight: "13px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div>
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {bottomRowItems.map((item, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="flex flex-col items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="rounded-lg overflow-hidden mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={`${item.text}`}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          e.target.src = "/Images/sampleImg.png";
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 text-center font-medium leading-tight"
                      style={{
                        maxWidth: "75px",
                        fontSize: "11px",
                        lineHeight: "13px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">🖼️</span>
              <p className="text-sm">
                Add images and titles for each item in the properties panel
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderSubBodyGrid = () => {
    return (
      <div
        className="w-full h-full min-h-48 bg-transparent"
        style={{
          padding: "20px 20px",
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>

        {component.props.items && component.props.items.length >= 3 ? (
          <div
            className="space-y-6 overflow-x-auto scrollbar-hide bg-transparent"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="relative">
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {component.props.items.map((item, index) => (
                  <div
                    key={`SubBodyGrid-${index}`}
                    className="flex flex-col items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="rounded-lg overflow-hidden mb-2"
                      style={{
                        width: "120px",
                        height: "140px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={`${item.text}`}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          e.target.src = "/Images/sampleImg.png";
                        }}
                      />
                    </div>
                    <span
                      className="text-xs text-gray-800 text-center font-medium leading-tight"
                      style={{
                        maxWidth: "120px",
                        fontSize: "16px",
                        lineHeight: "13px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">🖼️</span>
              <p className="text-sm">
                Add images and titles for each item in the properties panel
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderProductsGrid = () => {
    return (
      <div
        className="w-full h-full min-h-80 bg-transparent"
        style={{
          padding: "20px 20px",
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
        {component.props.products && component.props.products.length >= 1 ? (
          <div className="flex flex-col w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-normal text-black">
                {component.props.gridTitle.toUpperCase() || ""}
              </h3>
              <span className="text-[12px] font-normal underline text-blue-500 cursor-pointer">
                Show All
              </span>
            </div>

            {/* Products Grid */}
            <div className="flex  gap-4 overflow-x-auto scrollbar-hide">
              {component.props.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col min-w-[160px] hover:shadow-md transition-shadow duration-200"
                >
                  {/* Heart Icon */}
                  <div className="flex justify-end mb-2">
                    <svg
                      className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>

                  {/* Product Image Placeholder */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h4 className="text-sm font-medium text-black mb-2 line-clamp-2">
                    {product.name}
                  </h4>

                  {/* Price Section */}
                  <div className="mt-auto">
                    {product.pricelist_price !== product.list_price ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">
                          SAR {product.list_price.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          SAR {product.pricelist_price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        SAR {product.list_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Express Badge (if applicable) */}
                  {product.quantity > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414L10 1.586l3.707 3.707a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Express
                      </div>
                      {product.rating_count && (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-full transition-colors duration-200 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">🧰</span>
              <p className="text-sm">Add products in the properties panel</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderComponent = () => {
    switch (component.type) {
      case "banner":
        return (
          <div className="p-0">
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={bannerSliderRef}
                className="keen-slider"
                key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-fit min-h-64"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full min-h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "imageRow":
        return renderImageRow();
      case "subHeaderGrid":
        return renderSubHeaderGrid();
      case "subBodyGrid":
        return renderSubBodyGrid();
      case "videoText":
        return (
          <div className="bg-white relative">
            {component.props.video_url ? (
              <div className="relative w-full mb-4">
                {component.props.video_url.includes("youtube.com") ? (
                  <iframe
                    src={
                      component.props.video_url.replace("watch?v=", "embed/") +
                      "?autoplay=1&mute=1&loop=1&playlist=" +
                      component.props.video_url.split("v=")[1]
                    }
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-auto min-h-54"
                  />
                ) : (
                  <video
                    src={component.props.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto min-h-54"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="w-full h-full min-h-54 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🎥</span>
                  <p className="text-sm">
                    Add a video URL in the properties panel
                  </p>
                </div>
              </div>
            )}
            {component.props.title && (
              <h3 className="text-2xl font-semibold text-black absolute top-[78px] left-[64px] transform -translate-x-1/2 z-10">
                {component.props.title}
              </h3>
            )}
            {component.props.button_text && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors absolute top-[114px] right-1/2 transform -translate-x-1/2 z-10">
                {component.props.button_text}
              </button>
            )}
          </div>
        );
      case "imageText":
        return (
          <div className="bg-white relative">
            {component.props.image ? (
              <div className="relative w-full mb-4">
                <img
                  src={component.props.image}
                  alt="Image Text Background"
                  className="w-full h-full object-fit min-h-48"
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500 mt-16">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">
                    Add an image in the properties panel
                  </p>
                </div>
              </div>
            )}
            {component.props.title && (
              <h3 className="text-2xl font-semibold text-black absolute top-[48px] left-[64px] transform -translate-x-1/2 z-10">
                {component.props.title}
              </h3>
            )}
            {component.props.button_text && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors absolute top-[104px] right-1/2 transform -translate-x-1/2 z-10">
                {component.props.button_text}
              </button>
            )}
          </div>
        );
      case "bodyHalf":
        return (
          <div className="p-4">
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={bodyHalfSliderRef}
                className="keen-slider"
                // key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`BodyHalf ${index + 1}`}
                      className="w-full h-full min-h-48 object-fit rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "subBodyGrid":
        return (
          <div className="p-4">
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={subBodyGridSliderRef}
                className="keen-slider"
                // key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <div className="flex flex-col items-center">
                      <img
                        src={image}
                        alt={`subBodyGrid ${index + 1}`}
                        className="w-full h-full min-h-48 object-fit rounded-lg"
                      />
                      <span
                        className="text-xs text-gray-800 text-center font-medium leading-tight"
                        style={{
                          maxWidth: "75px",
                          fontSize: "11px",
                          lineHeight: "13px",
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "bodyPlain":
        return (
          <div className="p-0">
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={bodyPlainSliderRef}
                className="keen-slider"
                key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`bodyPlain ${index + 1}`}
                      className="w-full h-full object-fit min-h-48"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full min-h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "bodyRound":
        return (
          <div className="px-4">
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={bodyRoundSliderRef}
                className="keen-slider"
                key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`bodyRound ${index + 1}`}
                      className="w-full h-full rounded-lg object-fit min-h-48"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "brands":
        return (
          <div
            className="py-8 px-4 w-full h-full min-h-84 bg-cover bg-center"
            style={{ backgroundImage: `url(${component.props.bg_img})` }}
          >
            <h3 className="text-start w-full my-2 text-lg font-medium">
              {component.props.title}
            </h3>
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={brandsSliderRef}
                className="keen-slider"
                // key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`Brands ${index + 1}`}
                      className="w-full max-w-48 h-full min-h-64 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">
                    Add slide images, title and background image in the
                    properties panel
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "subCategBrands":
        return (
          <div className="py-8 px-4 w-full h-full min-h-84 bg-transparent">
            <h3 className="text-start w-full my-2 text-lg font-medium">
              {component.props.title}
            </h3>
            {component.props.images && component.props.images.length > 0 ? (
              <div
                ref={subCategBrandsSliderRef}
                className="keen-slider"
                // key={`${component.props.autoPlay}-${component.props.interval}`}
              >
                {component.props.images.map((image, index) => (
                  <div key={index} className="keen-slider__slide">
                    <img
                      src={image}
                      alt={`subCategBrands ${index + 1}`}
                      className="w-full max-w-48 h-full min-h-64 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full min-h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-sm">Add images in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        );
      case "productsGrid":
        return renderProductsGrid();
      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">
              Unknown component type: {component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderComponent()}

      {/* Delete button - only show when selected and not in preview */}
      {isSelected && !isPreview && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}

      {/* Selection indicator - only show when not in preview */}
      {isSelected && !isPreview && (
        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {component.type}
        </div>
      )}
    </div>
  );
};

export default MobileComponent;
