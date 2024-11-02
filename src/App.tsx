import { useState, useRef, useEffect } from "react";

type Command = {
  id: string;
  type: "turnLeft" | "turnRight" | "forward" | "f0" | "f1" | "f2";
  color?: "red" | "green" | "blue";
  sourceFunction?: string;
  sourceIndex?: number;
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
  color?: TileColor;
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
  const [isCollapsed, setIsCollapsed] = useState(true);

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
                <li>
                  Click a color button to select a color condition for new
                  commands
                </li>
                <li>Click the same color again to unselect it</li>
                <li>Drag commands out of functions to remove them</li>
                <li>Right-click a command in a function to remove it</li>
                <li>Colored commands only execute on matching colored tiles</li>
                <li>Uncolored commands work on any tile</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Execution</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Press ▶ to start executing the commands in f0</li>
                <li>Press ⏸ to stop execution at any time</li>
                <li>The execution preview shows the sequence that will run</li>
                <li>Function calls are expanded to show their contents</li>
                <li>The execution log shows each action as it happens</li>
                <li>Reach the star to complete the level</li>
                <li>Execution stops if trying to move off the grid</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Saving & Loading</h3>
              <ul className="list-disc list-inside text-sm">
                <li>
                  Enter a name and click "Save Map" to save your current map
                </li>
                <li>Click "Load" on a saved map to restore it</li>
                <li>Click ⋮ to show more options (Overwrite/Delete)</li>
                <li>Use Overwrite to update an existing map</li>
                <li>Click Delete to remove a saved map</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Replace the existing tile coordinate definitions with a default map
const DEFAULT_MAP: SavedMap = {
  id: "1730572305035",
  name: "Exported Map",
  tiles: [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "blue" },
    { color: "green" },
    { color: "blue" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ],
  startPosition: { x: 1, y: 5 },
  endPosition: { x: 14, y: 0 },
  mapSize: { width: 16, height: 10 },
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
  const [mapSize, setMapSize] = useState<MapSize>(DEFAULT_MAP.mapSize);
  const [startPosition, setStartPosition] = useState<Position>(
    DEFAULT_MAP.startPosition
  );
  const [endPosition, setEndPosition] = useState<Position>(
    DEFAULT_MAP.endPosition
  );
  const [tiles, setTiles] = useState<TileData[]>(DEFAULT_MAP.tiles);
  const [playerDirection, setPlayerDirection] = useState<Direction>("right");
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

  useEffect(() => {
    console.log("Functions updated:", functions);
  }, [functions]);

  const handleDragStart = (command: Command, e: React.DragEvent) => {
    draggedCommand.current = command;
    setDraggedItem({
      command,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDrop = (functionId: string) => {
    if (!draggedCommand.current) {
      console.log("No dragged command");
      return;
    }

    console.log("Handle drop:", {
      functionId,
      draggedCommand: draggedCommand.current,
      hasSourceFunction: "sourceFunction" in draggedCommand.current,
      sourceFunction: draggedCommand.current.sourceFunction,
      sourceIndex: draggedCommand.current.sourceIndex,
    });

    // If dropping back to source function, just cancel the drag
    if (
      "sourceFunction" in draggedCommand.current &&
      draggedCommand.current.sourceFunction === functionId &&
      draggedCommand.current.sourceIndex !== undefined
    ) {
      console.log("Dropping back to source function - cancelling");
      draggedCommand.current = null;
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Handle removal (empty functionId means remove)
    if (!functionId && "sourceFunction" in draggedCommand.current) {
      const sourceFunction = draggedCommand.current.sourceFunction;
      const sourceIndex = draggedCommand.current.sourceIndex;

      console.log("Removing command:", {
        sourceFunction,
        sourceIndex,
        currentFunctions: functions,
      });

      setFunctions((prev) => {
        const newFunctions = prev.map((f) => {
          if (f.id === sourceFunction) {
            console.log("Found function to remove from:", f.id);
            console.log("Before removal:", f.commands);
            const newCommands = [...f.commands];
            newCommands.splice(sourceIndex!, 1);
            console.log("After removal:", newCommands);
            return { ...f, commands: newCommands };
          }
          return f;
        });
        console.log("Updated functions:", newFunctions);
        return newFunctions;
      });

      draggedCommand.current = null;
      setDraggedItem(null);
      setDropTarget(null);
      setIsDraggingFromFunction(false);
      return;
    }

    // Normal drop into a function
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

    draggedCommand.current = null;
    setDraggedItem(null);
    setDropTarget(null);
    setIsDraggingFromFunction(false);
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

    if (isSettingEndPosition) {
      // Set end position
      const x = index % mapSize.width;
      const y = Math.floor(index / mapSize.width);
      setEndPosition({ x, y });
      setIsSettingEndPosition(false); // Turn off end position mode after setting
    } else {
      // Normal color cycling
      setTiles((prev) => {
        const newTiles = [...prev];
        const currentColor = newTiles[index].color;
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
    }
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
      <div className="text-base sm:text-xl font-bold text-white">
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

    const func = functions.find((f) => f.id === functionId);
    if (!func) return [];

    return func.commands.flatMap((command) => {
      if (["f0", "f1", "f2"].includes(command.type)) {
        // If it's a function call, expand it recursively
        return [
          // Add a visual separator for function calls
          {
            id: `${command.type}-start`,
            type: command.type,
            color: command.color,
          },
          ...expandCommands(command.type, depth + 1, maxDepth),
          {
            id: `${command.type}-end`,
            type: command.type,
            color: command.color,
          },
        ];
      }
      return [command];
    });
  };

  // Update the ExecutionPreview component's styling
  const ExecutionPreview = () => {
    const expandedCommands = expandCommands("f0");

    return (
      <div className="flex flex-col gap-2 mb-4 w-full">
        <h3 className="font-bold">Execution</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-4 rounded w-full">
          <div className="bg-gray-700 text-white p-2 rounded shrink-0">
            <span className="text-xs">▶</span>
          </div>

          {/* Update the scrolling container to fill available space */}
          <div className="flex-1 overflow-x-auto px-2">
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

          <div className="flex gap-2 shrink-0">
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
              onClick={() =>
                setActivePopover(activePopover === map.id ? null : map.id)
              }
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
  </div>;

  // Add these new states
  const [draggedItem, setDraggedItem] = useState<{
    command: Command;
    x: number;
    y: number;
  } | null>(null);

  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Update the useEffect for touch events to only prevent default on draggable elements
  useEffect(() => {
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.hasAttribute("draggable")) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, []);

  // Update the touch handlers
  const handleTouchStart = (command: Command, e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];

    setDraggedItem({
      command,
      x: touch.clientX,
      y: touch.clientY,
    });

    if ("sourceFunction" in command && command.sourceFunction) {
      draggedCommand.current = command;
    } else {
      draggedCommand.current = {
        ...command,
        sourceFunction: undefined,
        sourceIndex: undefined,
      };
    }

    console.log("Touch start dragged command:", draggedCommand.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!draggedItem) return;

    const touch = e.touches[0];
    setDraggedItem({
      ...draggedItem,
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!draggedItem || !draggedCommand.current) return;

    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const functionContainer = elements.find((el) =>
      el.hasAttribute("data-function-id")
    );

    if (functionContainer) {
      const functionId = functionContainer.getAttribute("data-function-id");
      if (functionId) {
        handleDrop(functionId);
      }
    }

    draggedCommand.current = null;
    setDraggedItem(null);
    setDropTarget(null);
  };

  // Add this new function to handle dragging from functions
  const handleFunctionDragStart = (
    functionId: string,
    commandIndex: number,
    e: React.DragEvent
  ) => {
    const command = functions.find((f) => f.id === functionId)?.commands[
      commandIndex
    ];
    if (!command) return;

    setDraggedItem({
      command,
      x: e.clientX,
      y: e.clientY,
    });

    setIsDraggingFromFunction(true);

    draggedCommand.current = {
      ...command,
      sourceFunction: functionId,
      sourceIndex: commandIndex,
    } as Command;
  };

  const [isDraggingFromFunction, setIsDraggingFromFunction] = useState(false);

  // Add this function to handle touch start from function commands
  const handleFunctionTouchStart = (
    functionId: string,
    commandIndex: number,
    e: React.TouchEvent
  ) => {
    console.log("Function touch start:", { functionId, commandIndex });
    e.stopPropagation();
    const command = functions.find((f) => f.id === functionId)?.commands[
      commandIndex
    ];
    if (!command) {
      console.log("Command not found");
      return;
    }

    const touch = e.touches[0];
    console.log("Touch coordinates:", { x: touch.clientX, y: touch.clientY });

    setDraggedItem({
      command,
      x: touch.clientX,
      y: touch.clientY,
    });

    setIsDraggingFromFunction(true);

    // Make sure we're setting the source information
    draggedCommand.current = {
      ...command,
      sourceFunction: functionId, // Make sure this is being set
      sourceIndex: commandIndex, // Make sure this is being set
    };

    console.log("Set dragged command:", draggedCommand.current);
  };

  // Update handleFunctionTouchEnd to handle dropping into the remove area
  const handleFunctionTouchEnd = (e: React.TouchEvent, functionId: string) => {
    console.log("Function touch end:", { functionId });
    e.stopPropagation();
    if (!draggedItem || !draggedCommand.current) {
      console.log("No dragged item or command");
      return;
    }

    console.log("Dragged command data:", draggedCommand.current);

    const touch = e.changedTouches[0];
    console.log("Touch end coordinates:", {
      x: touch.clientX,
      y: touch.clientY,
    });

    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    console.log(
      "Elements at touch point:",
      elements.map(
        (el) => `${el.tagName}${el.getAttribute("data-drop-target") || ""}`
      )
    );

    // Check if we're over a remove area
    const removeArea = elements.find((el) => {
      const dropId = el.getAttribute("data-drop-target");
      const isRemoveArea = dropId === `remove-${functionId}`;
      console.log("Checking element for remove area:", {
        dropId,
        isRemoveArea,
      });
      return isRemoveArea;
    });

    if (removeArea) {
      console.log(
        "Dropping in remove area, calling handleDrop with empty string"
      );
      // Use handleDrop with empty string to trigger removal
      handleDrop("");
    }

    // Clean up states
    draggedCommand.current = null;
    setDraggedItem(null);
    setDropTarget(null);
    setIsDraggingFromFunction(false);
  };

  // Add new state for end position mode
  const [isSettingEndPosition, setIsSettingEndPosition] = useState(false);

  // Add these functions near the other map handling functions
  const exportMap = () => {
    const mapToExport: SavedMap = {
      id: Date.now().toString(),
      name: "Exported Map",
      tiles,
      startPosition,
      endPosition,
      mapSize,
    };

    // Convert to JSON string
    const mapJson = JSON.stringify(mapToExport);

    // Create blob and download link
    const blob = new Blob([mapJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `map-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const mapData = JSON.parse(e.target?.result as string) as SavedMap;
        // Load the imported map
        setTiles(mapData.tiles);
        setStartPosition(mapData.startPosition);
        setEndPosition(mapData.endPosition);
        setMapSize(mapData.mapSize);
        setSelectedTile(getTileIndex(mapData.startPosition));
      } catch (error) {
        console.error("Error importing map:", error);
        alert("Invalid map file");
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 min-h-screen">
      {/* Left side - Main game content - add max-w-[60%] for desktop */}
      <div className="flex flex-col gap-4 w-full lg:max-w-[60%]">
        <Instructions />

        <div className="text-sm text-gray-600 mb-2">
          {isEditing
            ? isSettingEndPosition
              ? "Click a tile to set the end position (star)"
              : "Click tiles to change their color"
            : "Click tiles to set starting position"}
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
                className={`w-6 h-6 sm:w-8 sm:h-8 border border-neutral-200 grid place-items-center 
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
                    className={`text-base sm:text-2xl ${
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

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Edit/Start/Clear buttons */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                isEditing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
              }`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Stop Editing" : "Edit Map"}
            </button>

            {isEditing && (
              <>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                  onClick={handleClearMap}
                >
                  Clear Map
                </button>

                <button
                  className={`px-4 py-2 rounded-md ${
                    isSettingEndPosition ? "bg-purple-500" : "bg-gray-500"
                  } text-white`}
                  onClick={() => setIsSettingEndPosition(!isSettingEndPosition)}
                >
                  {isSettingEndPosition ? "Setting End..." : "Set End"}
                </button>
              </>
            )}

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => start()}
              disabled={isEditing}
            >
              Start
            </button>
          </div>

          {/* Map size controls */}
          <div className="flex flex-wrap gap-4">
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

          {/* Start position info */}
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">
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
                  onDragStart={(e) => handleDragStart(COMMANDS[0], e)}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleTouchStart(COMMANDS[0], e);
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    handleTouchMove(e);
                  }}
                  onTouchEnd={handleTouchEnd}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
                >
                  ↺
                </div>

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(COMMANDS[1], e)}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleTouchStart(COMMANDS[1], e);
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    handleTouchMove(e);
                  }}
                  onTouchEnd={handleTouchEnd}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
                >
                  ↻
                </div>

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(COMMANDS[2], e)}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleTouchStart(COMMANDS[2], e);
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    handleTouchMove(e);
                  }}
                  onTouchEnd={handleTouchEnd}
                  className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
                >
                  ↑
                </div>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              <div
                draggable
                onDragStart={(e) => handleDragStart(COMMANDS[3], e)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(COMMANDS[3], e);
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  handleTouchMove(e);
                }}
                onTouchEnd={handleTouchEnd}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
              >
                f0
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(COMMANDS[4], e)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(COMMANDS[4], e);
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  handleTouchMove(e);
                }}
                onTouchEnd={handleTouchEnd}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
              >
                f1
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(COMMANDS[5], e)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(COMMANDS[5], e);
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  handleTouchMove(e);
                }}
                onTouchEnd={handleTouchEnd}
                className="w-8 h-8 bg-gray-200 rounded grid place-items-center cursor-move touch-none"
              >
                f2
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() =>
                  setSelectedColor(selectedColor === "red" ? undefined : "red")
                }
                className={`w-8 h-8 bg-red-500 rounded ${
                  selectedColor === "red" ? "ring-2 ring-black" : ""
                }`}
              />
              <button
                onClick={() =>
                  setSelectedColor(
                    selectedColor === "green" ? undefined : "green"
                  )
                }
                className={`w-8 h-8 bg-green-500 rounded ${
                  selectedColor === "green" ? "ring-2 ring-black" : ""
                }`}
              />
              <button
                onClick={() =>
                  setSelectedColor(
                    selectedColor === "blue" ? undefined : "blue"
                  )
                }
                className={`w-8 h-8 bg-blue-500 rounded ${
                  selectedColor === "blue" ? "ring-2 ring-black" : ""
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Functions</h3>

            {functions.map((func) => (
              <div key={func.id} className="flex gap-2 items-start">
                <div
                  data-function-id={func.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropTarget(func.id);
                  }}
                  onDragLeave={() => setDropTarget(null)}
                  onDrop={() => {
                    handleDrop(func.id);
                    setDropTarget(null);
                    setDraggedItem(null);
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (
                      touch.clientX >= rect.left &&
                      touch.clientX <= rect.right &&
                      touch.clientY >= rect.top &&
                      touch.clientY <= rect.bottom
                    ) {
                      setDropTarget(func.id);
                    } else {
                      setDropTarget(null);
                    }
                  }}
                  className={`min-h-[100px] w-[200px] bg-gray-50 p-2 rounded border-2 ${
                    dropTarget === func.id
                      ? "border-blue-500 border-dashed bg-blue-50"
                      : "border-dashed"
                  }`}
                >
                  <div className="font-bold mb-2">{func.id}</div>

                  <div className="flex flex-wrap gap-1">
                    {func.commands.map((command, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) =>
                          handleFunctionDragStart(func.id, index, e)
                        }
                        onTouchStart={(e) =>
                          handleFunctionTouchStart(func.id, index, e)
                        }
                        onTouchMove={(e) => {
                          e.stopPropagation();
                          handleTouchMove(e);
                        }}
                        onTouchEnd={(e) => handleFunctionTouchEnd(e, func.id)}
                        onClick={() => handleCommandColorChange(func.id, index)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleRemoveCommand(func.id, index);
                        }}
                        className={`p-1 rounded text-sm cursor-move touch-none ${
                          command.color
                            ? `bg-${command.color}-500 hover:bg-${command.color}-400 text-white`
                            : "bg-gray-200 hover:bg-gray-300"
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
                    ))}
                  </div>
                </div>

                {/* Only show delete area if dragging from this function */}
                {draggedItem &&
                  isDraggingFromFunction &&
                  draggedCommand.current?.sourceFunction === func.id && (
                    <div
                      data-drop-target={`remove-${func.id}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropTarget(`remove-${func.id}`);
                      }}
                      onDragLeave={() => setDropTarget(null)}
                      onDrop={() => {
                        handleDrop("");
                        setDropTarget(null);
                      }}
                      onTouchMove={(e) => {
                        e.stopPropagation();
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        if (
                          touch.clientX >= rect.left &&
                          touch.clientX <= rect.right &&
                          touch.clientY >= rect.top &&
                          touch.clientY <= rect.bottom
                        ) {
                          setDropTarget(`remove-${func.id}`);
                        } else {
                          setDropTarget(null);
                        }
                      }}
                      className={`w-12 h-[100px] flex items-center justify-center rounded-lg transition-colors ${
                        dropTarget === `remove-${func.id}`
                          ? "bg-red-100 border-2 border-red-500"
                          : "bg-gray-100 border-2 border-gray-300"
                      }`}
                    >
                      <span className="text-sm text-gray-600 rotate-90">
                        Remove
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Logs and Save/Load - set fixed width */}
      <div className="flex flex-col gap-8 w-full lg:w-[300px] shrink-0">
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

          <div className="flex gap-2">
            <button
              onClick={exportMap}
              className="bg-purple-500 text-white px-4 py-1 rounded text-sm"
            >
              Export Map
            </button>

            <label className="bg-purple-500 text-white px-4 py-1 rounded text-sm cursor-pointer">
              Import Map
              <input
                type="file"
                accept=".json"
                onChange={importMap}
                className="hidden"
              />
            </label>
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
                      onClick={() =>
                        setActivePopover(
                          activePopover === map.id ? null : map.id
                        )
                      }
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

      {/* Add this at the end, just before the closing div */}
      {draggedItem && (
        <div
          style={{
            position: "fixed",
            left: draggedItem.x,
            top: draggedItem.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            opacity: 0.6,
            zIndex: 1000,
            touchAction: "none",
            marginTop: "-20px",
          }}
          className="w-8 h-8 bg-gray-200 rounded grid place-items-center"
        >
          {draggedItem.command.type === "turnLeft"
            ? "↺"
            : draggedItem.command.type === "turnRight"
            ? "↻"
            : draggedItem.command.type === "forward"
            ? "↑"
            : draggedItem.command.type}
        </div>
      )}
    </div>
  );
}

export default App;
