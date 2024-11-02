import { useState, useRef, useEffect } from "react";

type Command = {
  id: string;
  type: "turnLeft" | "turnRight" | "forward" | "f0" | "f1" | "f2";
  color?: "red" | "green" | "blue";
};

type FunctionSlot = {
  id: string;
  commands: Command[];
};

const INITIAL_FUNCTIONS: FunctionSlot[] = [
  { id: "f0", commands: [] },
  { id: "f1", commands: [] },
  { id: "f2", commands: [] },
];

const COMMANDS: Command[] = [
  { id: "turnLeft", type: "turnLeft" },
  { id: "turnRight", type: "turnRight" },
  { id: "forward", type: "forward" },
  { id: "f0", type: "f0" },
  { id: "f1", type: "f1" },
  { id: "f2", type: "f2" },
];

type MapSize = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

type TileColor = "red" | "green" | "blue" | undefined;
type TileData = {
  color: TileColor;
};

type Direction = "up" | "right" | "down" | "left";

type SavedMap = {
  id: string;
  name: string;
  tiles: TileData[];
  startPosition: Position;
  endPosition: Position;
  mapSize: MapSize;
};

const saveMapToStorage = (map: SavedMap) => {
  const savedMaps = JSON.parse(
    localStorage.getItem("savedMaps") || "[]"
  ) as SavedMap[];
  const existingMapIndex = savedMaps.findIndex((m) => m.id === map.id);

  if (existingMapIndex >= 0) {
    savedMaps[existingMapIndex] = map;
  } else {
    savedMaps.push(map);
  }

  localStorage.setItem("savedMaps", JSON.stringify(savedMaps));
};

const loadMapsFromStorage = (): SavedMap[] => {
  return JSON.parse(localStorage.getItem("savedMaps") || "[]");
};

// Add new type for execution logs
type ExecutionLog = {
  message: string;
  timestamp: number;
};

// Add this new component inside App
const Instructions = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed

  return (
    <div className="bg-blue-50 rounded-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 text-left flex justify-between items-center font-bold text-lg"
      >
        How to Play
        <span className="text-xl">{isCollapsed ? "▼" : "▲"}</span>
      </button>

      {!isCollapsed && (
        <div className="p-4 pt-0">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold mb-1">Map Editor</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Click "Edit Map" to enter edit mode</li>
                <li>
                  Click tiles to cycle through colors (none → red → green →
                  blue)
                </li>
                <li>Right-click anywhere to set the end position (star)</li>
                <li>
                  When not in edit mode, click to set the starting position
                </li>
                <li>Use width/height controls to resize the map</li>
                <li>Use "Clear Map" to reset all tiles</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Programming</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Drag commands from the Commands panel to the Functions</li>
                <li>
                  Commands: ↺ (turn left), ↻ (turn right), ↑ (move forward)
                </li>
                <li>
                  Function calls (f0, f1, f2) allow for repeated sequences
                </li>
                <li>
                  Click a command in a function to cycle its color condition
                </li>
                <li>Right-click a command in a function to remove it</li>
                <li>Colored commands only execute on matching colored tiles</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Execution</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Press ▶ to start executing the commands in f0</li>
                <li>Press ⏸ to stop execution at any time</li>
                <li>The execution preview shows the sequence that will run</li>
                <li>The execution log shows each action as it happens</li>
                <li>Reach the star to complete the level</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Saving & Loading</h3>
              <ul className="list-disc list-inside text-sm">
                <li>
                  Enter a name and click "Save Map" to save your current map
                </li>
                <li>Click "Load" on a saved map to restore it</li>
                <li>Click "Delete" to remove a saved map</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [selectedTile, setSelectedTile] = useState<number>(0);
  const [functions, setFunctions] = useState<FunctionSlot[]>(INITIAL_FUNCTIONS);
  const [selectedColor, setSelectedColor] = useState<
    "red" | "green" | "blue" | undefined
  >(undefined);
  const [isExecuting, setIsExecuting] = useState(false);
  const draggedCommand = useRef<Command | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapSize, setMapSize] = useState<MapSize>({ width: 14, height: 10 });
  const [startPosition, setStartPosition] = useState<Position>({ x: 1, y: 4 });
  const [tiles, setTiles] = useState<TileData[]>(() => {
    const initialTiles = Array.from({ length: 14 * 10 }, () => ({
      color: undefined as TileColor,
    }));

    // Set the horizontal blue path (8 tiles)
    const horizontalBlueTiles = [
      { x: 1, y: 4 }, // start (with arrow)
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
    ];

    // Set the green turning point
    const greenTile = { x: 9, y: 4 };

    // Set the diagonal blue path - adjusted to match the image exactly
    const diagonalBlueTiles = [
      { x: 10, y: 3 },
      { x: 11, y: 2 },
      { x: 12, y: 1 },
      { x: 13, y: 0 },
    ];

    // Apply horizontal blue tiles
    horizontalBlueTiles.forEach(({ x, y }) => {
      initialTiles[y * mapSize.width + x] = { color: "blue" as TileColor };
    });

    // Apply green tile
    initialTiles[greenTile.y * mapSize.width + greenTile.x] = {
      color: "green" as TileColor,
    };

    // Apply diagonal blue tiles
    diagonalBlueTiles.forEach(({ x, y }) => {
      initialTiles[y * mapSize.width + x] = { color: "blue" as TileColor };
    });

    return initialTiles;
  });
  const [playerDirection, setPlayerDirection] = useState<Direction>("right");
  const [endPosition, setEndPosition] = useState<Position>({ x: 13, y: 0 });
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [mapName, setMapName] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("");

  // Add a ref to track execution state
  const isExecutingRef = useRef(false);

  // Update the state setter
  const setIsExecutingWithRef = (value: boolean) => {
    isExecutingRef.current = value;
    setIsExecuting(value);
  };

  useEffect(() => {
    setSavedMaps(loadMapsFromStorage());
  }, []);

  const handleDragStart = (command: Command) => {
    draggedCommand.current = command;
  };

  const handleDrop = (functionId: string) => {
    if (!draggedCommand.current) return;

    const newCommand: Command = {
      ...draggedCommand.current,
      color: selectedColor,
    };

    setFunctions((prev) =>
      prev.map((f) =>
        f.id === functionId
          ? { ...f, commands: [...f.commands, newCommand] }
          : f
      )
    );
  };

  const getTileIndex = (pos: Position): number => pos.y * mapSize.width + pos.x;

  const isValidPosition = (pos: Position): boolean =>
    pos.x >= 0 && pos.x < mapSize.width && pos.y >= 0 && pos.y < mapSize.height;

  const executeCommand = (
    command: Command,
    currentPosition: Position,
    currentDirection: Direction
  ): { position: Position; direction: Direction } => {
    let newDirection = currentDirection;
    const newPosition = { ...currentPosition };

    switch (command.type) {
      case "turnLeft":
        newDirection =
          currentDirection === "up"
            ? "left"
            : currentDirection === "left"
            ? "down"
            : currentDirection === "down"
            ? "right"
            : "up";
        break;
      case "turnRight":
        newDirection =
          currentDirection === "up"
            ? "right"
            : currentDirection === "right"
            ? "down"
            : currentDirection === "down"
            ? "left"
            : "up";
        break;
      case "forward":
        switch (currentDirection) {
          case "up":
            newPosition.y--;
            break;
          case "right":
            newPosition.x++;
            break;
          case "down":
            newPosition.y++;
            break;
          case "left":
            newPosition.x--;
            break;
        }
        break;
    }

    return { position: newPosition, direction: newDirection };
  };

  const executeFunction = async (
    functionId: string,
    depth: number = 0,
    startPosition: Position,
    startDirection: Direction
  ): Promise<{ position: Position; direction: Direction }> => {
    console.log("Current execution state:", isExecutingRef.current);

    if (!isExecutingRef.current) {
      console.log("Execution stopped by user");
      addLog("Execution stopped by user");
      return { position: startPosition, direction: startDirection };
    }

    console.log(`Executing function ${functionId} at depth ${depth}`);
    console.log(
      `Starting position:`,
      startPosition,
      `direction:`,
      startDirection
    );

    if (depth > 1000) {
      console.log("Max depth reached, returning");
      return { position: startPosition, direction: startDirection };
    }

    const func = functions.find((f) => f.id === functionId);
    if (!func) {
      console.log("Function not found:", functionId);
      return { position: startPosition, direction: startDirection };
    }

    console.log(`Found function ${functionId} with commands:`, func.commands);
    let currentPosition = { ...startPosition };
    let currentDirection = startDirection;

    for (const command of func.commands) {
      if (!isExecutingRef.current) {
        console.log("Execution stopped by user");
        addLog("Execution stopped by user");
        return { position: currentPosition, direction: currentDirection };
      }

      console.log(`Executing command:`, command);

      const currentTile = getTileIndex(currentPosition);
      const tileColor = tiles[currentTile].color;

      // Check color condition - skip if command has a color requirement that doesn't match
      if (command.color && command.color !== tileColor) {
        const message = `Skipping ${command.type} (requires ${command.color} tile)`;
        console.log(message);
        addLog(message);
        setCurrentAction(message);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCurrentAction("");
        continue;
      }

      // Handle function calls
      if (["f0", "f1", "f2"].includes(command.type)) {
        const message = `Calling function ${command.type}`;
        console.log(message);
        addLog(message);
        setCurrentAction(message);
        const result = await executeFunction(
          command.type,
          depth + 1,
          currentPosition,
          currentDirection
        );
        currentPosition = result.position;
        currentDirection = result.direction;
        setCurrentAction("");
        continue;
      }

      // Execute the command and get the potential new position/direction
      const result = executeCommand(command, currentPosition, currentDirection);

      // Handle direction changes
      if (result.direction !== currentDirection) {
        const message = `Turning ${
          command.type === "turnLeft" ? "left" : "right"
        }`;
        console.log(message);
        addLog(message);
        setCurrentAction(message);
        currentDirection = result.direction;
        setPlayerDirection(currentDirection);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Handle movement - stop execution if move is invalid
      if (command.type === "forward") {
        if (!isValidPosition(result.position)) {
          const message = "Cannot move forward - stopping execution";
          console.log(message);
          addLog(message);
          setCurrentAction(message);
          await new Promise((resolve) => setTimeout(resolve, 500));
          setCurrentAction("");
          setIsExecutingWithRef(false);
          return { position: currentPosition, direction: currentDirection };
        }

        const message = "Moving forward";
        console.log(message);
        addLog(message);
        setCurrentAction(message);
        currentPosition = { ...result.position };
        setSelectedTile(getTileIndex(currentPosition));
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setCurrentAction("");
      await new Promise((resolve) => setTimeout(resolve, 100));

      // After updating position, check if we've reached the end
      if (getTileIndex(currentPosition) === getTileIndex(endPosition)) {
        const message = "Success! Reached the end!";
        console.log(message);
        addLog(message);
        setCurrentAction(message);
        setIsSuccess(true); // Set success state
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Pause to show success
        setIsExecutingWithRef(false);
        return { position: currentPosition, direction: currentDirection };
      }
    }

    return { position: currentPosition, direction: currentDirection };
  };

  const start = async () => {
    setExecutionLogs([]); // Clear previous logs
    setIsSuccess(false); // Reset success state at start
    console.log("Starting execution...");
    addLog("Starting execution...");
    const initialTileIndex = getTileIndex(startPosition);
    setSelectedTile(initialTileIndex);
    const initialDirection = "right";
    setPlayerDirection(initialDirection);
    setIsExecutingWithRef(true);
    console.log(
      "Initial position:",
      startPosition,
      "direction:",
      initialDirection
    );
    console.log(
      "Initial commands in f0:",
      functions.find((f) => f.id === "f0")?.commands
    );

    try {
      const result = await executeFunction(
        "f0",
        0,
        startPosition,
        initialDirection
      );
      console.log(
        "Execution completed. Final position:",
        result.position,
        "direction:",
        result.direction
      );
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      setIsExecutingWithRef(false);
    }
  };

  const handleTileClick = (index: number) => {
    if (!isEditing) return;

    setTiles((prev) => {
      const newTiles = [...prev];
      const currentColor = newTiles[index].color;

      // Cycle through colors: undefined -> red -> green -> blue -> undefined
      const nextColor: TileColor =
        currentColor === undefined
          ? "red"
          : currentColor === "red"
          ? "green"
          : currentColor === "green"
          ? "blue"
          : undefined;

      newTiles[index] = { color: nextColor };
      return newTiles;
    });
  };

  const handleMapSizeChange = (
    dimension: "width" | "height",
    value: number
  ) => {
    const newSize = {
      ...mapSize,
      [dimension]: Math.max(1, Math.min(20, value)), // Limit size between 1 and 20
    };

    setMapSize(newSize);

    // Resize tiles array
    setTiles(
      Array.from(
        { length: newSize.width * newSize.height },
        (_, i) => tiles[i] || { color: undefined }
      )
    );

    // Ensure start position is still valid
    if (startPosition.x >= newSize.width || startPosition.y >= newSize.height) {
      setStartPosition({ x: 0, y: 0 });
    }
  };

  const handleSetStartPosition = (index: number) => {
    if (isEditing) return;

    const x = index % mapSize.width;
    const y = Math.floor(index / mapSize.width);
    setStartPosition({ x, y });
    setSelectedTile(index);
  };

  const handleSetEndPosition = (index: number) => {
    const x = index % mapSize.width;
    const y = Math.floor(index / mapSize.width);
    setEndPosition({ x, y });
  };

  const PlayerCharacter = ({ direction }: { direction: Direction }) => {
    const arrowDirections = {
      up: "↑",
      right: "→",
      down: "↓",
      left: "←",
    };

    return (
      <div className="text-xl font-bold text-white">
        {arrowDirections[direction]}
      </div>
    );
  };

  const handleSaveMap = () => {
    if (!mapName.trim()) {
      alert("Please enter a map name");
      return;
    }

    const mapToSave: SavedMap = {
      id: Date.now().toString(),
      name: mapName,
      tiles: tiles,
      startPosition,
      endPosition,
      mapSize,
    };

    saveMapToStorage(mapToSave);
    setSavedMaps(loadMapsFromStorage());
    setMapName("");
  };

  const handleLoadMap = (map: SavedMap) => {
    setTiles(map.tiles);
    setStartPosition(map.startPosition);
    setEndPosition(map.endPosition);
    setMapSize(map.mapSize);
    setSelectedTile(getTileIndex(map.startPosition));
  };

  const handleDeleteMap = (mapId: string) => {
    const updatedMaps = savedMaps.filter((m) => m.id !== mapId);
    localStorage.setItem("savedMaps", JSON.stringify(updatedMaps));
    setSavedMaps(updatedMaps);
  };

  const handleClearMap = () => {
    setTiles(
      Array.from({ length: mapSize.width * mapSize.height }, () => ({
        color: undefined as TileColor,
      }))
    );
  };

  // Add this new function to handle command removal
  const handleRemoveCommand = (functionId: string, commandIndex: number) => {
    setFunctions((prev) =>
      prev.map((f) => {
        if (f.id === functionId) {
          const newCommands = [...f.commands];
          newCommands.splice(commandIndex, 1);
          return { ...f, commands: newCommands };
        }
        return f;
      })
    );
  };

  // Add this function to handle color changes for existing commands
  const handleCommandColorChange = (
    functionId: string,
    commandIndex: number
  ) => {
    setFunctions((prev) =>
      prev.map((f) => {
        if (f.id === functionId) {
          const newCommands = [...f.commands];
          const currentColor = newCommands[commandIndex].color;

          // Cycle through colors: undefined -> red -> green -> blue -> undefined
          let nextColor: TileColor;
          if (currentColor === undefined) nextColor = "red";
          else if (currentColor === "red") nextColor = "green";
          else if (currentColor === "green") nextColor = "blue";
          else nextColor = undefined;

          newCommands[commandIndex] = {
            ...newCommands[commandIndex],
            color: nextColor,
          };

          return { ...f, commands: newCommands };
        }
        return f;
      })
    );
  };

  const addLog = (message: string) => {
    setExecutionLogs((prev) => [...prev, { message, timestamp: Date.now() }]);
  };

  // Add this helper function to expand commands
  const expandCommands = (
    functionId: string,
    depth: number = 0,
    maxDepth: number = 3
  ): Command[] => {
    if (depth > maxDepth) {
      return [{ id: "...", type: "f0", color: undefined }]; // Show ellipsis for deep recursion
    }

    const func = functions.find(f => f.id === functionId);
    if (!func) return [];

    return func.commands.flatMap(command => {
      if (["f0", "f1", "f2"].includes(command.type)) {
        // If it's a function call, expand it recursively
        return [
          // Add a visual separator for function calls
          { id: `${command.type}-start`, type: command.type, color: command.color },
          ...expandCommands(command.type, depth + 1, maxDepth),
          { id: `${command.type}-end`, type: command.type, color: command.color },
        ];
      }
      return [command];
    });
  };

  // Update the ExecutionPreview component's styling
  const ExecutionPreview = () => {
    const expandedCommands = expandCommands("f0");

    return (
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="font-bold">Execution</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-4 rounded">
          <div className="bg-gray-700 text-white p-2 rounded">
            <span className="text-xs">▶</span>
          </div>

          {/* Add padding to the scrolling container */}
          <div className="max-w-[500px] overflow-x-auto px-2">
            <div className="flex gap-2 items-center min-w-fit py-1">
              {expandedCommands.map((command, index) => {
                if (command.id === "...") {
                  return (
                    <div
                      key={index}
                      className="w-8 h-8 grid place-items-center rounded bg-gray-200"
                    >
                      ...
                    </div>
                  );
                }

                // Check if it's a function call separator
                if (command.id.endsWith("-start")) {
                  return (
                    <div
                      key={index}
                      className="flex items-center text-gray-500 px-1"
                    >
                      {command.type}(
                    </div>
                  );
                }

                if (command.id.endsWith("-end")) {
                  return (
                    <div
                      key={index}
                      className="flex items-center text-gray-500 px-1"
                    >
                      )
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`w-8 h-8 grid place-items-center rounded ${
                      command.color
                        ? `bg-${command.color}-500 text-white`
                        : "bg-gray-200"
                    }`}
                  >
                    {command.type === "turnLeft"
                      ? "↺"
                      : command.type === "turnRight"
                      ? "↻"
                      : command.type === "forward"
                      ? "↑"
                      : command.type}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 ml-auto shrink-0">
            <button
              onClick={() => {
                console.log("Starting execution");
                start();
              }}
              disabled={isEditing || isExecuting}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <span className="text-xs">▶</span>
            </button>
            <button
              onClick={() => {
                console.log("Pausing execution");
                setIsExecutingWithRef(false);
              }}
              disabled={!isExecuting}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <span className="text-xs">⏸</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this new function to handle overwriting maps
  const handleOverwriteMap = (mapToOverwrite: SavedMap) => {
    const updatedMap: SavedMap = {
      ...mapToOverwrite,
      tiles: tiles,
      startPosition,
      endPosition,
      mapSize,
    };

    saveMapToStorage(updatedMap);
    setSavedMaps(loadMapsFromStorage());
  };

  // Add this new state near the other state declarations
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Update the saved maps section JSX
  <div className="flex flex-col gap-2">
    {savedMaps.map((map) => (
      <div
        key={map.id}
        className="flex items-center justify-between bg-gray-50 p-2 rounded"
      >
        <span>{map.name}</span>

        <div className="flex gap-2">
          <button
            onClick={() => handleLoadMap(map)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Load
          </button>

          <div className="relative">
            <button
              onClick={() => setActivePopover(activePopover === map.id ? null : map.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
            >
              ⋮
            </button>

            {activePopover === map.id && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setActivePopover(null)}
                />
                <div className="absolute right-0 mt-1 bg-white rounded shadow-lg border py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      handleOverwriteMap(map);
                      setActivePopover(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-yellow-600"
                  >
                    Overwrite
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteMap(map.id);
                      setActivePopover(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      {/* Left side - Main game content */}
      <div className="flex flex-col gap-4">
        <Instructions />

        <div className="text-sm text-gray-600 mb-2">
          {isEditing
            ? "Click tiles to change their color. Right-click to set end position."
            : "Click tiles to set starting position. Right-click to set end position."}
        </div>

        <div
          className="grid w-fit"
          style={{
            gridTemplateColumns: `repeat(${mapSize.width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${mapSize.height}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: mapSize.width * mapSize.height }).map(
            (_, index) => (
              <div
                key={index}
                data-tile={index}
                data-color={tiles[index].color}
                onClick={() => {
                  if (isEditing) {
                    handleTileClick(index);
                  } else {
                    handleSetStartPosition(index);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleSetEndPosition(index);
                }}
                className={`h-8 w-8 border border-neutral-200 grid place-items-center 
                ${
                  getTileIndex(startPosition) === index
                    ? "ring-2 ring-yellow-500"
                    : ""
                }
                ${selectedTile === index ? "ring-2 ring-black" : ""}
                ${
                  tiles[index].color
                    ? `bg-${tiles[index].color}-500 hover:bg-${tiles[index].color}-400 text-white`
                    : "hover:bg-gray-100"
                }
                cursor-pointer
              `}
              >
                {getTileIndex(endPosition) === index ? (
                  <div
                    className={`text-2xl ${
                      tiles[index].color ? "text-white" : "text-blue-500"
                    } ${isSuccess ? "animate-pulse" : ""}`}
                  >
                    ★
                  </div>
                ) : (
                  selectedTile === index && (
                    <div className="relative">
                      {currentAction && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/75 text-white text-xs px-2 py-1 rounded">
                          {currentAction}
                        </div>
                      )}
                      <PlayerCharacter direction={playerDirection} />
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>

        <ExecutionPreview />

        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                isEditing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
              }`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Stop Editing" : "Edit Map"}
            </button>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => start()}
              disabled={isEditing}
            >
              Start
            </button>

            {isEditing && (
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                onClick={handleClearMap}
              >
                Clear Map
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Width:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={mapSize.width}
                onChange={(e) =>
                  handleMapSizeChange("width", parseInt(e.target.value))
                }
                className="w-16 px-2 py-1 border rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Height:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={mapSize.height}
                onChange={(e) =>
                  handleMapSizeChange("height", parseInt(e.target.value))
                }
                className="w-16 px-2 py-1 border rounded"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">
              Start: ({startPosition.x}, {startPosition.y})
            </span>
            <button
              onClick={() => setStartPosition({ x: 0, y: 0 })}
              className="text-sm text-blue-500 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Commands</h3>

            <div className="flex gap-2 mb-4">
              <div className="flex gap-1">
                <div
                  draggable
                  onDragStart={() => handleDragStart(COMMANDS[0])}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
                >
                  ↺
                </div>

                <div
                  draggable
                  onDragStart={() => handleDragStart(COMMANDS[1])}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
                >
                  ↻
                </div>

                <div
                  draggable
                  onDragStart={() => handleDragStart(COMMANDS[2])}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
                >
                  ↑
                </div>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              <div
                draggable
                onDragStart={() => handleDragStart(COMMANDS[3])}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
              >
                f0
              </div>
              <div
                draggable
                onDragStart={() => handleDragStart(COMMANDS[4])}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
              >
                f1
              </div>
              <div
                draggable
                onDragStart={() => handleDragStart(COMMANDS[5])}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move"
              >
                f2
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setSelectedColor("red")}
                className={`w-8 h-8 bg-red-500 rounded ${
                  selectedColor === "red" ? "ring-2 ring-black" : ""
                }`}
              />
              <button
                onClick={() => setSelectedColor("green")}
                className={`w-8 h-8 bg-green-500 rounded ${
                  selectedColor === "green" ? "ring-2 ring-black" : ""
                }`}
              />
              <button
                onClick={() => setSelectedColor("blue")}
                className={`w-8 h-8 bg-blue-500 rounded ${
                  selectedColor === "blue" ? "ring-2 ring-black" : ""
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Functions</h3>

            {functions.map((func) => (
              <div
                key={func.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(func.id)}
                className="min-h-[100px] w-[200px] bg-gray-50 p-2 rounded border-2 border-dashed"
              >
                <div className="font-bold mb-2">{func.id}</div>

                <div className="flex flex-wrap gap-1">
                  {func.commands.map((command, index) => (
                    <div
                      key={index}
                      onClick={() => handleCommandColorChange(func.id, index)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleRemoveCommand(func.id, index);
                      }}
                      className={`p-1 rounded text-sm cursor-pointer ${
                        command.color
                          ? `bg-${command.color}-500 hover:bg-${command.color}-400 text-white`
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      title="Left click to change color, Right click to remove"
                    >
                      {command.type === "turnLeft"
                        ? "↺"
                        : command.type === "turnRight"
                        ? "↻"
                        : command.type === "forward"
                        ? "↑"
                        : command.type}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Logs and Save/Load */}
      <div className="flex flex-col gap-8 lg:min-w-[300px]">
        {/* Execution Log */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Execution Log</h3>
          <div className="w-full h-[200px] bg-gray-50 p-2 rounded border overflow-y-auto">
            {executionLogs.map((log, index) => (
              <div key={index} className="text-sm">
                {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Save/Load Maps */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">Save/Load Maps</h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Enter map name"
              className="px-2 py-1 border rounded flex-1"
            />

            <button
              onClick={handleSaveMap}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Save Map
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {savedMaps.map((map) => (
              <div
                key={map.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{map.name}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadMap(map)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Load
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setActivePopover(activePopover === map.id ? null : map.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      ⋮
                    </button>

                    {activePopover === map.id && (
                      <>
                        <div
                          className="fixed inset-0"
                          onClick={() => setActivePopover(null)}
                        />
                        <div className="absolute right-0 mt-1 bg-white rounded shadow-lg border py-1 z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              handleOverwriteMap(map);
                              setActivePopover(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-yellow-600"
                          >
                            Overwrite
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteMap(map.id);
                              setActivePopover(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
