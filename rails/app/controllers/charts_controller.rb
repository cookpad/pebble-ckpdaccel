class ChartsController < ApplicationController
  def index
    @watches = watches
  end

  private

    def watches
      AccelerometerDataPoint.pluck(:watch_id).uniq
    end
end
