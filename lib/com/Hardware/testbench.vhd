library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;


entity testbench is
end entity; 

architecture from_verilog of testbench is
  signal sys_clk : std_logic := '0';  
  signal sys_rst : std_logic := '0';  
  signal addr : unsigned(31 downto 0) := X"00000000";  
  signal data : unsigned(31 downto 0) := X"00000000";  
begin
  -- Removed one empty process
  
  
  -- Generated from always process in testbench (testbench.v:11)
  process is
  begin
    wait for 5 ms;
    sys_clk <= not sys_clk;
  end process;
  
  -- Generated from always process in testbench (testbench.v:14)
  process is
  begin
    wait for 50 ms;
    sys_rst <= '1';
  end process;
  
  -- Generated from always process in testbench (testbench.v:17)
  process is
  begin
    if sys_rst = '1' then
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
    if sys_rst = '1' then
      wait for 10 ms;
      data <= data + X"00000001";
      wait for 10 ms;
    else
      wait for 10 ms;
      data <= X"00000000";
      wait for 10 ms;
    end if;
  end process;
  
end architecture;

