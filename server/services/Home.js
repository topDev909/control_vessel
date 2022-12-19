const sql = require("mssql");
const config = require("../config/config");
const { interfaceObj } = require("./interfaces/SQLInterface.js");

("use strict");
class Home {
  
  constructor() {
    this.sqlInterface = interfaceObj;
  }

  async GetHome() {
    let results = await this.sqlInterface.PerformQueryPromise(
      `
        SELECT "BOOM ANGLE" as BOOMANGLE, "AF OR CURR" as AFCURR, "AF JIB CURR" as JIBCURR, "AF OR MAX" as AFMAX, "JIB OR MAX" as JIBMAX , 
        CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
        AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time'))) as ReceivedDateTime
        FROM [VesselCare].[dbo].[AH2CurrentData] cross apply openjson(AH2Datafieldvalues) 
        with (CLMS nvarchar(max) as json) as lev1
        cross apply openjson(lev1.CLMS) 
        with ("BOOM OUTREACH" nvarchar(max) as json) as lev2
        cross apply openjson(lev2."BOOM OUTREACH") 
        with ("BOOM ANGLE"  numeric(10,2),"AF OR CURR" numeric(10,2),"AF JIB CURR" numeric(10,2),"AF OR MAX" numeric(10,2), "JIB OR MAX" numeric(10,2)) as lev3
        where AH2Datafieldvalues  like '%CLMS%'
        `,
      []
    );
    return results;
    // this.sqlInterface.PerformQuery(`
    // Select * from test where id = 31 union
    // Select * from test where id = 3
    // `, [], (result, err) => {
    //     if (err) console.log("error", err);
    //     else callback(result[1], err);
    // })

  }

  async GetAssets() {
    let results = await this.sqlInterface.PerformQueryPromise(
      `
            Select 'M1' as Asset,JSON_VALUE([AH2Datafieldvalues],N'$.DeviceID') as DeviceID, CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
            AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time'))) as ReceivedDateTime,  JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M1.LOAD') as Load, ISNULL(REPLACE(ltrim(rtrim(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M1.COLOR'))),'',null),'RED') as Color, JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M1.LOC') as Location from [VesselCare].[dbo].[AH2CurrentData] where AH2Datafieldvalues  like '%CLMS%' and JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M1.COLOR') is not null Union
            Select 'M2' as Asset,JSON_VALUE([AH2Datafieldvalues],N'$.DeviceID') as DeviceID,CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
            AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time'))) as ReceivedDateTime, JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M2.LOAD') , ISNULL(REPLACE(ltrim(rtrim(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M2.COLOR'))),'',null),'GREEN') as Color, JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M2.LOC') as Location from [VesselCare].[dbo].[AH2CurrentData] where AH2Datafieldvalues  like '%CLMS%' and JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M2.COLOR') is not null union 
            Select 'M3' as Asset,JSON_VALUE([AH2Datafieldvalues],N'$.DeviceID') as DeviceID,CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
            AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time'))) as ReceivedDateTime,  JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M3.LOAD') , ISNULL(REPLACE(ltrim(rtrim(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M3.COLOR'))),'',null),'YELLOW') as Color, JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M3.LOC') as Location from [VesselCare].[dbo].[AH2CurrentData] where AH2Datafieldvalues  like '%CLMS%' and JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M3.COLOR') is not null union 
            Select 'M4' as Asset,JSON_VALUE([AH2Datafieldvalues],N'$.DeviceID') as DeviceID,CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
            AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time'))) as ReceivedDateTime,  JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M4.LOAD') , ISNULL(REPLACE(ltrim(rtrim(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M1.COLOR'))),'',null),'BLUE') as Color, JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M4.LOC') as Location  from [VesselCare].[dbo].[AH2CurrentData] where AH2Datafieldvalues  like '%CLMS%' and JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.M4.COLOR') is not null
        `,
      []
    );
    return results;
  }

  async GetMapData() {
    console.log("before getMapData");
    let results = await this.sqlInterface.PerformQueryPromise(
      `
      SELECT [AH2DataEntryId]
      ,[assetEntryDataId]
      ,[AH2Datafieldvalues]
      ,[AH2DataReceivedDate]
      FROM [VesselCare].[dbo].[AH2CurrentData]
      WHERE [AH2DataEntryId] = 4
        `,
      []
    );
    return results;
  }

  async GetCLMSHistoryData() {
    await this.sqlInterface
    .PerformQuery(`ALTER PROCEDURE [dbo].[GetCLMSHistoryData] 
    -- Add the parameters for the stored procedure here
    @SelectedDate varchar(50),   
    @selectDateTo varchar(50),
    @Asset varchar(50),
    @Series varchar(30),
    @intervals int  
    AS
    BEGIN
      -- SET NOCOUNT ON added to prevent extra result sets from
      -- interfering with SELECT statements.
      SET NOCOUNT ON;
      declare @sql varchar(5000)
    
      IF @Asset  = 'AH2Data'
      
      BEGIN	
      
        set @sql = 'Select max(dateadd(hh,8, Dateadd(ss, cast (JSON_VALUE([AH2Datafieldvalues], N''$.CLMS.DATE_TIME'') as int),''1970-01-01''))) as ReceivedDateTime, 
        CONVERT(datetime,'''+@SelectedDate+''',120) as xmin ,
        CONVERT(datetime,'''+@selectDateTo+''',120) as xmax ,';
      
            IF (charindex('M1', @Series) > 0)
            BEGIN
            set @sql = @sql + 'avg(cast (JSON_VALUE([AH2Datafieldvalues],N''$.CLMS.M1.LOAD'') as int)) AS value,';
            END
            
            IF (charindex('M2', @Series) > 0)
            BEGIN
            set @sql = @sql + 'avg(cast (JSON_VALUE([AH2Datafieldvalues],N''$.CLMS.M2.LOAD'') as int)) AS value2,';
            END
            
            IF (charindex('M3', @Series) > 0)
            BEGIN
            set @sql = @sql + 'avg(cast (JSON_VALUE([AH2Datafieldvalues],N''$.CLMS.M3.LOAD'') as int)) AS value3,';
            END
            
            IF (charindex('M4', @Series) > 0)
            BEGIN
            set @sql = @sql + 'avg(cast (JSON_VALUE([AH2Datafieldvalues],N''$.CLMS.M4.LOAD'') as int)) AS value4,';
            END
        
            set @sql = LEFT(@sql, LEN(@sql) - 1) ;
            set @sql = @sql + ' from [VesselCare].[dbo].[AH2Data]  where AH2Datafieldvalues  like ''%CLMS%'' and ISJSON(AH2Datafieldvalues)>0 and (';
      
            IF (charindex('M1', @Series) > 0)
            BEGIN
            set @sql = @sql + ' JSON_VALUE([AH2Datafieldvalues], N''$.CLMS.M1.COLOR'') is not null OR';
            END
            
            IF (charindex('M2', @Series) > 0) 
            BEGIN
            set @sql = @sql + ' JSON_VALUE([AH2Datafieldvalues], N''$.CLMS.M2.COLOR'') is not null OR';
            END
            
            IF (charindex('M3', @Series) > 0)
            BEGIN
            set @sql = @sql + ' JSON_VALUE([AH2Datafieldvalues], N''$.CLMS.M3.COLOR'') is not null OR';
            END
            
            IF (charindex('M4', @Series) > 0)
            BEGIN
            set @sql = @sql + ' JSON_VALUE([AH2Datafieldvalues], N''$.CLMS.M4.COLOR'') is not null OR';
            END
            set @sql = LEFT(@sql, LEN(@sql) - 2) ;
            set @sql = @sql + ' ) AND AH2DataReceivedDate between CONVERT(datetime, ''' + @SelectedDate + ''',120) and  CONVERT(datetime, ''' + @selectDateTo + ''' ,120) Group By '; 
            set @sql = @sql + '	DATEPART(YEAR, AH2DataReceivedDate), DATEPART(MONTH, AH2DataReceivedDate), ';
            set @sql = @sql + '	DATEPART(DAY, AH2DataReceivedDate), ';
            set @sql = @sql + '	DATEPART(HOUR, AH2DataReceivedDate), ';
            set @sql = @sql + ' (DATEPART(MINUTE, AH2DataReceivedDate) / '+ CONVERT(varchar(10),@intervals) +') ';
            set @sql = @sql + '	order by 1 desc ';
          EXEC (@sql);
          print @sql;
      END
    END`);
  }

  async GetCLMSHistoryData_AH2() {
    await this.sqlInterface
    .PerformQuery(`DECLARE @SelectedDate varchar(50), @selectDateTo varchar(50) , @Asset varchar(50), @intervals int,@Series varchar(10) 
    SELECT @SelectedDate = @SelectedDate
    SELECT @selectDateTo = @selectDateTo
    SELECT @Asset = @Asset
    SELECT @intervals = @intervals
    SELECT @Series = @Series
    EXECUTE [dbo].[GetCLMSHistoryData] @SelectedDate = @SelectedDate , @selectDateTo = @selectDateTo,
    @Asset = @Asset , @intervals=@intervals ,@Series = @Series`);
  }

  async GetAh2Data() {
    //console.log("before AH2Data");
    let results = await this.sqlInterface.PerformQueryPromise(
      `
      Select  max(CONVERT(datetime, SWITCHOFFSET(AH2DataReceivedDate, DATEPART(TZOFFSET, 
      AH2DataReceivedDate AT TIME ZONE 'Singapore Standard Time')))) as ReceivedDateTime
      , max("BOOM ANGLE") as BOOMANGLE, max("AF OR CURR") as AFCURR, max("AF JIB CURR") as JIBCURR, max("BOOM ANGLE") + 10 as BAMAX, max("BOOM ANGLE") - 10 as BAMIN
      from [VesselCare].[dbo].[AH2Data]  
      cross apply openjson(AH2Datafieldvalues) 
        with (CLMS nvarchar(max) as json) as lev1
        cross apply openjson(lev1.CLMS) 
        with ("BOOM OUTREACH" nvarchar(max) as json) as lev2
        cross apply openjson(lev2."BOOM OUTREACH") 
        with ("BOOM ANGLE"  numeric(10,2),"AF OR CURR" numeric(10,2),"AF JIB CURR" numeric(10,2)) as lev3
      where AH2Datafieldvalues  like '%CLMS%'  and 
      AH2DataReceivedDate > Dateadd(MINUTE,-5 ,GETDATE())   
      Group By DATEPART(YEAR, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))),
      DATEPART(MONTH, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))),
      DATEPART(DAY, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))),
      DATEPART(HOUR, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))),
      DATEPART(MINUTE, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))),
      DATEPART(SECOND, dateadd(hh,8, Dateadd(ss, cast(JSON_VALUE([AH2Datafieldvalues],N'$.CLMS.DATE_TIME') as int),'1970-01-01'))) order by 1 desc
      `,
      []
    );
    return results;
  }


}
module.exports = Home;
