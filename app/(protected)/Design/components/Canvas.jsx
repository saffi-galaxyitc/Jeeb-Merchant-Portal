import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MobileComponent from "./MobileComponent";

const SortableComponent = ({
  component,
  isSelected,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onImageUpload,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleComponentClick = (component, event) => {
    event.stopPropagation();
    onSelectComponent(component);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${
        selectedComponent?.id === component.id ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={(e) => handleComponentClick(component, e)}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 w-6 h-6 bg-gray-500 text-white rounded flex items-center justify-center text-xs cursor-move hover:bg-gray-600 transition-colors z-10"
        style={{
          display: selectedComponent?.id === component.id ? "flex" : "none",
        }}
      >
        ⋮⋮
      </div>

      <MobileComponent
        component={component}
        isSelected={selectedComponent?.id === component.id}
        onUpdate={onUpdateComponent}
        onDelete={onDeleteComponent}
        onImageUpload={onImageUpload}
      />
    </div>
  );
};

const Canvas = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onImageUpload,
  scale,
}) => {
  const handleCanvasClick = () => {
    onSelectComponent(null);
  };

  return (
    <div className="relative group">
      {/* Mobile Frame */}
      <div
        className="relative bg-black rounded-[2rem] p-2 shadow-2xl"
        style={{ transform: `scale(${scale / 100})` }}
      >
        {/* Screen */}
        <div
          className="w-[425px] h-[767px] bg-white rounded-tl-[1.5rem] rounded-tr-[1.5rem] overflow-hidden relative"
          style={{ marginBottom: "72px" }}
          onClick={handleCanvasClick}
        >
          {/* Status Bar */}
          <div className="h-11 bg-white flex items-center justify-between px-4 text-xs font-medium border-b border-gray-100">
            <div className="flex items-center space-x-1">
              <span>9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">📶</span>
              <span className="text-xs">📶</span>
              <span className="text-xs">🔋</span>
            </div>
          </div>

          {/* App Content */}
          <div className="h-[calc(100%-44px)] overflow-y-auto bg-gray-100">
            {components.length === 0 ? (
              <div className="flex items-center justify-center h-full text-black-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-sm font-medium">Start building your app</p>
                  <p className="text-xs mt-2">
                    Add components from the left panel
                  </p>
                  <div className="mt-4 text-xs text-black-100">
                    <p>💡 Try starting with a Header</p>
                    <p>📦 Add some Product Grids</p>
                    <p>🦶 Finish with a Footer</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {components.map((component) => (
                  <SortableComponent
                    key={component.id}
                    component={component}
                    selectedComponent={selectedComponent}
                    onSelectComponent={onSelectComponent}
                    onUpdateComponent={onUpdateComponent}
                    onDeleteComponent={onDeleteComponent}
                    onImageUpload={onImageUpload}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav Bar */}
        <div className="absolute bottom-2 z-30 left-1/2 transform -translate-x-1/2 w-[426px] bg-white rounded-bl-[1.55rem] rounded-br-[1.55rem] border px-8 py-3 flex items-center h-18 justify-between gap-4">
          <div className="flex flex-col items-center">
            <img src="/images/home.png" alt="Home" className="w-7 h-7" />
            <span className="text-sm font-bold text-blue-500">Home</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/images/cart.png" alt="Cart" className="w-6 h-6" />
            <span className="text-sm font-semibold text-gray-500">Cart</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/images/more.png" alt="More" className="w-6 h-6" />
            <span className="text-sm font-semibold text-gray-500">More</span>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 z-40 left-1/2 transform -translate-x-1/2 w-44 h-1 bg-black rounded-full"></div>
      </div>

      {/* Canvas Info */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded-lg">
        {scale}% • {components.length} components
      </div>

      {/* Grid Lines (Optional) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
    </div>
  );
};

export default Canvas;
