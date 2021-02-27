library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

-- Generated from Verilog module testbench (testbench.v:1)
--   ADDR_WIDTH = 32
--   DATA_WIDTH = 32
--   MAIN_FRE = 100
entity testbench is
end entity; 

-- Generated from Verilog module testbench (testbench.v:1)
--   ADDR_WIDTH = 32
--   DATA_WIDTH = 32
--   MAIN_FRE = 100
architecture from_verilog of testbench is
  signal addr : unsigned(31 downto 0) := X"00000000";  -- Declared at testbench.v:9
  signal clk : std_logic := '0';  -- Declared at testbench.v:6
  signal data : unsigned(31 downto 0) := X"00000000";  -- Declared at testbench.v:8
  signal sys_rst_n : std_logic := '0';  -- Declared at testbench.v:7
begin
  -- Removed one empty process
  
  
  -- Generated from always process in testbench (testbench.v:11)
  process is
  begin
    wait for 5 ms;
    clk <= not clk;
  end process;
  
  -- Generated from always process in testbench (testbench.v:14)
  process is
  begin
    wait for 50 ms;
    sys_rst_n <= '1';
  end process;
  
  -- Generated from always process in testbench (testbench.v:17)
  process is
  begin
    if sys_rst_n = '1' then
      wait for 10 ms;
      addr <= addr + X"00000001";
      wait for 10 ms;
    else
      wait for 10 ms;
      addr <= X"00000000";
      wait for 10 ms;
    end if;
  end process;
  
  -- Generated from always process in testbench (testbench.v:25)
  process is
  begin
    if sys_rst_n = '1' then
      wait for 10 ms;
      data <= data + X"00000001";
      wait for 10 ms;
    else
      wait for 10 ms;
      data <= X"00000000";
      wait for 10 ms;
    end if;
  end process;
  
  -- Generated from initial process in testbench (testbench.v:42)
  process is
  begin
    null;  -- Unsupported system task $dumpfile omitted here (testbench.v:43)
    null;  -- Unsupported system task $dumpvars omitted here (testbench.v:44)
    wait;
  end process;
end architecture;

